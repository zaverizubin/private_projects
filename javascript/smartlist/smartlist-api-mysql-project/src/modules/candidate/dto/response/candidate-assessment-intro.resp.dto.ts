import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Assessment } from 'src/entities/assessment.entity';
import { Organization } from 'src/entities/organization.entity';

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
    organization: Organization,
    assessment: Assessment,
    blockCount: number,
    questionCount: number,
  ) {
    this.logo_url = organization.logo != null ? organization.logo.url : null;
    this.org_name = organization.name;
    this.org_about = organization.about;
    this.assessment_intro = assessment.introduction;
    this.assessment_video_link_url = assessment.videoLinkURL;
    this.assessment_header_image_url =
      assessment.headerImage != null ? assessment.headerImage.url : null;
    this.position = assessment.position;
    this.assessment_blocks = blockCount;
    this.assessment_questions = questionCount;
  }
}
