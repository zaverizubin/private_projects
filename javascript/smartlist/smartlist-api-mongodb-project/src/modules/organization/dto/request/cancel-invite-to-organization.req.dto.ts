import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class OrganizationCancelInviteReqDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
