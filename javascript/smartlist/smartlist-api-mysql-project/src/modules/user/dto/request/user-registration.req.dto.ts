import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { REGEX } from 'src/utils/app.utils';

export class UserRegistrationReqDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Length(3, 24)
  @Matches(REGEX.PASSWORD, {
    message:
      'Password should have 1 upper case, 1 lowercase and 1 number or special character',
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;
}
