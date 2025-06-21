import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
