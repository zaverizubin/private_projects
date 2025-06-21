import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class DuplicateAssessmentForOrganizationsReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  assessment_id: string;

  @ApiProperty({
    type: String,
  })
  organization_ids: string[];
}
