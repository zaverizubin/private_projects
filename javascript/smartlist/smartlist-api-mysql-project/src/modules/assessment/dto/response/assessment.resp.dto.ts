import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUrl, Min } from 'class-validator';
import { Assessment } from 'src/entities/assessment.entity';

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
    type: Number,
  })
  @IsInt()
  @Min(1)
  header_image_id: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsUrl()
  video_link_url: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @Min(1)
  organization_id: number;

  constructor(assessment: Assessment) {
    this.id = assessment.id;
    this.name = assessment.name;
    this.position = assessment.position;
    this.department = assessment.department;
    this.introduction = assessment.introduction;
    this.status = assessment.status;
    this.token = assessment.token;
    this.header_image_id =
      assessment.headerImage != null ? assessment.headerImage.id : null;
    this.video_link_url = assessment.videoLinkURL;
    this.organization_id =
      assessment.organization != null ? assessment.organization.id : null;
  }
}
