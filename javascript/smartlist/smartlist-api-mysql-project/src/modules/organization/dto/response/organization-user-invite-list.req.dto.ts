import { ApiProperty } from '@nestjs/swagger';
import { UserEmailInvite } from 'src/entities/user-email-invite.entity';

export class OrganizationUserInviteListRespDto {
  @ApiProperty()
  emails: string[];

  constructor(userEmailInvites: UserEmailInvite[]) {
    this.emails = [];
    userEmailInvites.forEach((obj, index) => {
      this.emails.push(obj.email);
    });
  }
}
