import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationReqDto } from './create-organization.req.dto';

export class UpdateOrganizationReqDto extends PartialType(
  CreateOrganizationReqDto,
) {
  constructor(about: string) {
    super();
    this.about = about;
  }
}
