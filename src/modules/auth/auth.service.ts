import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { HydraService } from '../hydra/hydra.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hydraService: HydraService
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getByEmailAndPass(email, password);
    if (!user) {
      throw new UnauthorizedException('Wrong login combination!');
    }
    return user;
  }

  async introspectToken(token): Promise<boolean> {
    const { active, token_type } = await this.hydraService.introspectToken(token);
    return active && token_type === 'access_token';
  }
}
