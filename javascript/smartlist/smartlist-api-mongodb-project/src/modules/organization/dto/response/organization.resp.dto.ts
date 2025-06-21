import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDocument } from 'src/schemas/organization.schema';

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
  logo_id: string;

  constructor(organizationDocument: OrganizationDocument) {
    this.id = organizationDocument.id.toString();
    this.name = organizationDocument.name;
    this.url = organizationDocument.url || '';
    this.contact_number = organizationDocument.contact_number || '';
    this.about = organizationDocument.about || '';
    this.logo_id =
      organizationDocument.logo != null ? organizationDocument.logo.id.toString() : null;
    this.email = organizationDocument.email || '';
  }
}
