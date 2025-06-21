import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';

export class CandidateAssessmentIntroRespDto {
  @ApiProperty({
    type: String,
  })
  @IsInt()
  logo_url: string;

  @ApiProperty({
    type: String,
  })
  org_name: string;

  @ApiProperty({
    type: String,
  })
  org_about: string;

  @ApiProperty({
    type: String,
  })
  assessment_intro: string;

  @ApiProperty({
    type: String,
  })
  assessment_header_image_url: string;

  @ApiProperty({
    type: String,
  })
  assessment_video_link_url: string;

  @ApiProperty({
    type: String,
  })
  position: string;

  @ApiProperty({
    type: Number,
  })
  assessment_blocks: number;

  @ApiProperty({
    type: Number,
  })
  assessment_questions: number;

  constructor(
    organizationDocument: OrganizationDocument,
    assessmentDocument: AssessmentDocument,
    blockCount: number,
    questionCount: number,
  ) {
    this.logo_url = organizationDocument.logo != null ? organizationDocument.logo.url : null;
    this.org_name = organizationDocument.name;
    this.org_about = organizationDocument.about;
    this.assessment_intro = assessmentDocument.introduction;
    this.assessment_video_link_url = assessmentDocument.video_link_url;
    this.assessment_header_image_url =
      assessmentDocument.header_image != null ? assessmentDocument.header_image.url : null;
    this.position = assessmentDocument.position;
    this.assessment_blocks = blockCount;
    this.assessment_questions = questionCount;
  }
}
