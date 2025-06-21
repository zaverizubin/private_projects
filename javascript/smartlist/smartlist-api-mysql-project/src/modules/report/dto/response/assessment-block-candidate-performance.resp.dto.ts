import { ApiProperty } from '@nestjs/swagger';

export class AssessmentBlockCandidatePerformanceRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  score: number;

  constructor(rawData: any) {
    this.id = Number(rawData.id);
    this.name = rawData.name;
    this.score = Number(rawData.score);
  }
}
