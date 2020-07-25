import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
    if (!user.confirmedAt) {
      throw new UnauthorizedException('You did not confirmed your email');
    }
    if (user.resetPasswordToken) {
      throw new UnauthorizedException('You did not finished reset password');
    }
    return user;
  }

  async confirmUserAccount(confirmationToken: string): Promise<User> {
    const user = await this.userService.getByConfirmationToken(confirmationToken);
    if (!user) {
      throw new InternalServerErrorException('Confirmation token not found');
    }
    if (user.confirmedAt != null) {
      throw new ConflictException('Already confirmed user');
    }
    user.confirmedAt = new Date();
    return await this.userService.save(user);
  }

  async introspectToken(token): Promise<boolean> {
    const { active, token_type } = await this.hydraService.introspectToken(
      token,
    );

    return active && token_type === 'access_token';
  }
}
