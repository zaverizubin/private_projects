import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/entities/organization.entity';

export class OrganizationRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  contact_number: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  about: string;

  @ApiProperty()
  logo_id: number;

  constructor(organization: Organization) {
    this.id = organization.id;
    this.name = organization.name;
    this.url = organization.url || '';
    this.contact_number = organization.contact_number || '';
    this.about = organization.about || '';
    this.logo_id = organization.logo != null ? organization.logo.id : null;
    this.email = organization.email || '';
  }
}
