import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class TokenModel {

  @IsNumber()
  expiresIn: number;

  @IsString()
  accessToken: string;

  @IsNumber()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
