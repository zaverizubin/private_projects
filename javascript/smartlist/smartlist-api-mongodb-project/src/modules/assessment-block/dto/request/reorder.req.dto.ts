import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReorderReqDto {
  @ApiProperty({
    type: [String],
  })
  @IsNotEmpty()
  ids: string[];
}
