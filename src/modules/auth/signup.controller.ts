import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignupDomain } from '../../domains/signup.domain';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';


export class SignupController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signup(@Body() payload: SignupDomain): Promise<User> {
    return await this.userService.create(payload);
  }

  @Get('confirm')
  @ApiResponse({ status: 201, description: 'Successful Confirmation' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async confirm(@Query() confirmToken: string): Promise<User> {
    return await this.authService.confirmUserAccount(confirmToken);
  }
}
