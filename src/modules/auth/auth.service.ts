import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { HydraService } from '../hydra/hydra.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hydraService: HydraService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const foundUser = await this.userService.getByEmail(email);
    if (foundUser === undefined) {
      throw new UnauthorizedException('Wrong login combination!');
    }

    try {
      if (await argon2.verify(foundUser.password, password)) {
        return foundUser;
      }
    } catch (err) {
      throw new UnauthorizedException('Error when verifying password');
    }

    throw new UnauthorizedException('Wrong login combination!');
  }

  async introspectToken(token): Promise<boolean> {
    const { active, token_type } = await this.hydraService.introspectToken(token);
    return active && token_type === 'access_token';
  }
}
