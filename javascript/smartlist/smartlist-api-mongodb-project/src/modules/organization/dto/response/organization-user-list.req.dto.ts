import { ApiProperty } from '@nestjs/swagger';
import { OrganizationUserRespDto } from './organization-user.resp.dto';

export class OrganizationUserListRespDto {
  @ApiProperty()
  users: OrganizationUserRespDto[];

  constructor(users: OrganizationUserRespDto[]) {
    this.users = users;
  }
}
