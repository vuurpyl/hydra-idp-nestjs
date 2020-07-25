import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConsentConfirmDomain {

  @IsString()
  challenge: string;

  @IsString()
  submit: string;

  @IsNotEmpty()
  grant_scope: any;

  @IsOptional()
  @IsString()
  remember: string;
}
