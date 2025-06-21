import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class OrganizationUserRespDto {
  @ApiProperty()
  id: number;

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

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.department = user.department;
    this.active = user.active;
  }
}
