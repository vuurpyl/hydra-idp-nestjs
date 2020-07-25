import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class SignupDomain {

  @ApiModelProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiModelProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiModelProperty({ required: true })
  @IsString()
  lastName: string;

  @ApiModelProperty({ required: true })
  @IsString()
  password: string;

  @ApiModelProperty({ required: true })
  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  @MaxLength(50, { message: 'Username is too long' })
  username: string;
}
