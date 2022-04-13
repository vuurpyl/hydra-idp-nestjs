import { Controller, Body, Post, Get, Request, Req, Res, Query, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ConsentConfirmDomain } from '../../domains/consent.confirm.domain';
import { ConsentService } from './consent.service';
import { SigninService } from './signin.service';
import { LoginDomain } from '../../domains/login.domain';

@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly consentService: ConsentService,
    private readonly loginService: SigninService
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
          session: {},
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
    const body = {
      grant_scope,
      session: {},
      grant_access_token_audience: response.requested_access_token_audience,
      remember: Boolean(remember),
      remember_for: 3600,
    };
    return res.redirect(await this.consentService.acceptConsentRequest(challenge, body));
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
    const { email, password, challenge, remember, submit } = credentialsDto;

    if (submit === 'Deny access') {
      return res.redirect( await this.loginService.rejectLoginRequest(challenge));
    }

    try {
      const user = await this.authService.validateUser(email, password);
      return res.redirect(await this.loginService.acceptLoginRequestAndRemember(challenge, credentialsDto.email, Boolean(remember)));
    } catch(error) {
      return res.render('login', { challenge, error: 'The username / password combination is not correct' });
    }
  }
}
