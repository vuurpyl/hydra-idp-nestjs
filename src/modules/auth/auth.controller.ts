import { Controller, Body, Post, UseGuards, Get, Request, Req, Res, Query } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignupDomain } from '../../domains/signup.domain';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ConsentConfirmDomain } from '../../domains/consent.confirm.domain';
import { ConsentService } from './consent.service';
import { LoginService } from './login.service';
import { LoginDomain } from '../../domains/login.domain';

@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly consentService: ConsentService,
    private readonly loginService: LoginService
  ) {}

  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request) {
    return Object.assign(request.user);
  }

  @Get('consent')
  async consent(@Query('consent_challenge') challenge: string, @Req() req, @Res() res) {
    const response = await this.consentService.getConsentRequest(challenge);

    if (response.skip) {
      return res.redirect(
        await this.consentService.acceptConsentRequest(challenge, {
          grant_scope: response.requested_scope,
          grant_access_token_audience: response.requested_access_token_audience,

          // The session allows us to set session data for id and access tokens
          session: {
            // This data will be available when introspecting the token. Try to avoid sensitive information here,
            // unless you limit who can introspect tokens.
            // access_token: { foo: 'bar' },
            // This data will be available in the ID token.
            // id_token: { baz: 'bar' },
          },
        }),
      );
    }

    return res.render('consent', {
      challenge,
      requested_scope: response.requested_scope,
      user: response.subject,
      client: response.client,
    });
  }

  @Post('consent')
  async confirmConsent(@Body() confirmDto: ConsentConfirmDomain, @Req() req, @Res() res) {
    const { submit, challenge, remember } = confirmDto;
    let { grant_scope } = confirmDto;

    if (submit === 'Deny access') {
      return res.redirect(
        await this.consentService.rejectConsentRequest(challenge, 'access_denied', 'The resource owner denied the request'),
      );
    }

    if (!Array.isArray(grant_scope)) {
      grant_scope = [grant_scope];
    }

    const response = await this.consentService.getConsentRequest(challenge);

    return res.redirect(
      await this.consentService.acceptConsentRequest(challenge, {
        grant_scope,
        session: {},
        grant_access_token_audience: response.requested_access_token_audience,
        remember: Boolean(remember),
        remember_for: 3600,
      }),
    );
  }

  @Get('login')
  async login(@Query('login_challenge') challenge: string, @Req() req, @Res() res) {
    const { skip, subject } = await this.loginService.getLoginRequest(challenge);

    if (skip) {
      return res.redirect( await this.loginService.acceptLoginRequest(challenge, subject) );
    }

    return res.render('login', { challenge });
  }

  @Post('login')
  async loginWithCredentials(@Body() credentialsDto: LoginDomain, @Req() req, @Res() res) {
    const { email, password, challenge, remember } = credentialsDto;

    if (!(email === 'foo@bar.com' && password === 'foobar')) {
      return res.render('login', { challenge, error: 'The username / password combination is not correct' });
    }

    return res.redirect(
      await this.loginService.acceptLoginRequestAndRemember(challenge, `foo@bar.com`, Boolean(remember)),
    );
  }
}
