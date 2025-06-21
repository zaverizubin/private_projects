import { ApiProperty } from '@nestjs/swagger';

export class HighLevelSummaryRespDto {
  @ApiProperty()
  unique_assessments: number;

  @ApiProperty()
  candidate_submissions: number;

  @ApiProperty()
  candidates_smartlisted: number;

  constructor(
    uniqueAssessments: number,
    candidateSubmissions: number,
    candidatesSmartlisted: number,
  ) {
    this.unique_assessments = uniqueAssessments;
    this.candidate_submissions = candidateSubmissions;
    this.candidates_smartlisted = candidatesSmartlisted;
  }
}
