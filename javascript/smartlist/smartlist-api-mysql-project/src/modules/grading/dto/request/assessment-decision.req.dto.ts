import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AssessmentDecisionReqDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  decision: string;
}
