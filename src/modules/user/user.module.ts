import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule { }
