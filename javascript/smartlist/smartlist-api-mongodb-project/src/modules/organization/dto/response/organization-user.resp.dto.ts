import { ApiProperty } from '@nestjs/swagger';
import { UserDocument } from 'src/schemas/user.schema';

export class OrganizationUserRespDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  active: boolean;

  constructor(userDocument: UserDocument) {
    this.id = userDocument.id.toString();
    this.name = userDocument.name;
    this.email = userDocument.email;
    this.role = userDocument.role;
    this.department = userDocument.department;
    this.active = userDocument.active;
  }
}
