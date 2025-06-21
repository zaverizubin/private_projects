import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf, IsInt } from 'class-validator';

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
    type: Number,
  })
  @ValidateIf((u) => u.photo_id != '')
  @IsInt()
  photo_id: number;
}
