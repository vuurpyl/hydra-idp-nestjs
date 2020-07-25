import { HttpModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule} from '@nestjs/config';
import { HydraModule } from '../hydra/hydra.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
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
    LoginService,
    ConsentService
  ],
  exports: [
  ],
})
export class AuthModule {
}
