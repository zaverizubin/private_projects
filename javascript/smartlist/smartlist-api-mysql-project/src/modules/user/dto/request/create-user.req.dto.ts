import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { REGEX } from 'src/utils/app.utils';

export class CreateUserReqDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 12)
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must be 6 - 12 characters long with 1 upper case, 1 lowercase and 1 number or special character',
  })
  password: string;
}
