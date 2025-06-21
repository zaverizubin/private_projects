import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDocument } from 'src/schemas/user.schema';

export class UserRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  role: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  designation: string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  organization_id: string;

  @ApiProperty()
  photo_id: string;

  constructor(userDocument: UserDocument) {
    this.id = userDocument.id.toString();
    this.name = userDocument.name;
    this.email = userDocument.email;
    this.active = userDocument.active;
    this.role = userDocument.role;
    this.department = userDocument.department;
    this.designation = userDocument.designation;
    this.photo_id = userDocument.photo != null ? userDocument.photo.toString() : null;
    this.organization_id =
      userDocument.organizationDocument != null ? userDocument.organizationDocument.toString() : null;
  }
}
