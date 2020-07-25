import { Body, Controller, Post} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignupDomain } from '../../domains/signup.domain';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller()
export class SignupController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'Successful Signup' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signup(@Body() payload: SignupDomain): Promise<User> {
    return await this.userService.create(payload);
  }
}
