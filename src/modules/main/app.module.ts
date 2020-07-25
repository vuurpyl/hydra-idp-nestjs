import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResponseTimeMiddleware } from '../../shared/middlewares/response.time.middleware';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../health/health.controller';
import auth from '../../config/auth.config';
import databaseConfig from '../../config/database.config';
import { HydraModule } from '../hydra/hydra.module';
import { User } from '../user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [auth, databaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [User],
        migrationsRun: configService.get<boolean>('database.migrationsRun'),
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize')
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    HydraModule,
    AuthModule
  ],
  controllers: [ AppController, HealthController ],
  providers: [ AppService ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseTimeMiddleware)
      .forRoutes('*');
  }
}

