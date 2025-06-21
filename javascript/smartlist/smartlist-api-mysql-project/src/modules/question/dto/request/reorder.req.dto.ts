import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReorderReqDto {
  @ApiProperty({
    type: [Number],
  })
  @IsNotEmpty()
  ids: number[];
}
