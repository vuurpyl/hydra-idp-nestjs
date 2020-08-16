import { HttpModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule} from '@nestjs/config';
import { HydraModule } from '../hydra/hydra.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { SigninService } from './signin.service';
import { ConsentService } from './consent.service';
import { SignupController } from './signup.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    HydraModule,
    UserModule,
  ],
  controllers: [
    AuthController,
    SignupController
  ],
  providers: [
    AuthService,
    SigninService,
    ConsentService
  ],
  exports: [
  ],
})
export class AuthModule {
}
