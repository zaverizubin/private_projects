import { ApiProperty } from '@nestjs/swagger';

export class AssessmentBlockCandidatePerformanceRespDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  score: number;

  constructor(rawData: any) {
    this.id = rawData.id.toString();
    this.name = rawData.name;
    this.score = Number(rawData.score);
  }
}
