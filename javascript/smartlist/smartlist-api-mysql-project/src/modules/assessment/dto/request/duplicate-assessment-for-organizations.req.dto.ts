import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class DuplicateAssessmentForOrganizationsReqDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  assessment_id: number;

  @ApiProperty({
    type: Number,
  })
  @ValidateIf((a) => a.organization_ids != null)
  @IsNumber({}, { each: true })
  organization_ids: number[];
}
