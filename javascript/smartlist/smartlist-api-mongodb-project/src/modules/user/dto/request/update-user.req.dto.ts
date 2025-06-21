import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateUserReqDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  designation: string;

  @ApiPropertyOptional({
    type: String,
  })
  @ValidateIf((u) => u.photo_id != '')
  photo_id: string;
}
