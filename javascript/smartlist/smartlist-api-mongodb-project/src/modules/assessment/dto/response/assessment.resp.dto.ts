import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUrl, Min } from 'class-validator';
import { AssessmentDocument } from 'src/schemas/assessment.schema';

export class AssessmentRespDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  introduction: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  token: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsUrl()
  video_link_url: string;

  @ApiPropertyOptional({
    type: String,
  })
  header_image_id: string;

  @ApiProperty({
    type: String,
  })
  organization_id: string;

  constructor(assessmentDocument: AssessmentDocument) {
    this.id = assessmentDocument.id;
    this.name = assessmentDocument.name;
    this.position = assessmentDocument.position;
    this.department = assessmentDocument.department;
    this.introduction = assessmentDocument.introduction;
    this.status = assessmentDocument.status;
    this.token = assessmentDocument.token;
    this.video_link_url = assessmentDocument.video_link_url;
    this.header_image_id =
      assessmentDocument.header_image != null
        ? assessmentDocument.header_image.toString()
        : null;

    this.organization_id =
      assessmentDocument.organizationDocument != null
        ? assessmentDocument.organizationDocument.toString()
        : null;
  }
}
