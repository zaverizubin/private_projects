import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateCandidateReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  contact_number: string;
}
