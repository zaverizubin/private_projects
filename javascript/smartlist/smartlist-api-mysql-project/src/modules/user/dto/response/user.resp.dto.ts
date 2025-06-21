import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

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
  organization_id: number;

  @ApiProperty()
  photo_id: number;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.active = user.active;
    this.role = user.role;
    this.department = user.department;
    this.designation = user.designation;
    this.photo_id = user.photo != null ? user.photo.id : null;
    this.organization_id =
      user.organization != null ? user.organization.id : null;
  }
}
