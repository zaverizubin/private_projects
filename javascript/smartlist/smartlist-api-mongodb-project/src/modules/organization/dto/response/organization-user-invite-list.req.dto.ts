import { ApiProperty } from '@nestjs/swagger';
import { UserInviteDocument } from 'src/schemas/user-invite.schema';

export class OrganizationUserInviteListRespDto {
  @ApiProperty()
  emails: string[];

  constructor(userInviteDocuments: UserInviteDocument[]) {
    this.emails = [];
    userInviteDocuments.forEach((obj, index) => {
      this.emails.push(obj.email);
    });
  }
}
