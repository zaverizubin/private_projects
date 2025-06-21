import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';
import { Assessment } from 'src/entities/assessment.entity';

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
    type: Number,
  })
  @IsInt()
  @ValidateIf((a) => a.header_image_id != null)
  @Min(1)
  header_image_id: number;

  @ApiPropertyOptional({
    type: String,
  })
  @ValidateIf((a) => a.video_link_url != '')
  @IsUrl()
  video_link_url: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  @Min(1)
  organization_id: number;

  
}
