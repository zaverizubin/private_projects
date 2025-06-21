import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, ValidateIf } from 'class-validator';

export class AssessmentReqDto {
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

  @ApiPropertyOptional({
    type: String,
  })
  @ValidateIf((a) => a.header_image_id != null)
  header_image_id: string;

  @ApiPropertyOptional({
    type: String,
  })
  @ValidateIf((a) => a.video_link_url != '')
  @IsUrl()
  video_link_url: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  organization_id: string;
}
