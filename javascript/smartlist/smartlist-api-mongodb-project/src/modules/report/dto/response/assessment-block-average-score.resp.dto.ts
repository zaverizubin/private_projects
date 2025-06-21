import { ApiProperty } from '@nestjs/swagger';

export class AssessmentBlockAverageScoreRespDto {
  @ApiProperty()
  assessment_block_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  average_score: number;

  constructor(dataObj: any) {
    this.assessment_block_id = dataObj.assessmentBlockId;
    this.title = dataObj.title;
    this.average_score = Number(dataObj.score);
  }
}
