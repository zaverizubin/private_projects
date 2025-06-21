import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegenerateVerificationEmailReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
