import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt } from 'class-validator';

export class InviteToOrganizationReqDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsEmail({}, { each: true })
  emails: string[];

  constructor(emails: string[]) {
    this.emails = emails;
  }
}
