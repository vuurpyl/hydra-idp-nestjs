import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginDomain {

  @ApiModelProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiModelProperty({ required: true })
  @IsString()
  password: string;

  @IsString()
  challenge: string;

  @IsOptional()
  @IsString()
  remember: string;
}
