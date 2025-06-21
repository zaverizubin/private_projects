import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InviteToOrganizationReqDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsEmail({}, { each: true })
  emails: string[];

  constructor(emails: string[]) {
    this.emails = emails;
  }
}
