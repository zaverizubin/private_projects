import { ApiProperty } from '@nestjs/swagger';

export class AssessmentCandidatePerformanceRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  last_submission_date: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  assessment_decision: string;

  @ApiProperty()
  candidate_average_score: number;

  @ApiProperty()
  group_average_score: number;

  constructor(rawData: any) {
    this.id = Number(rawData.id);
    this.name = rawData.name;
    this.start_date = rawData.startDate;
    this.end_date = rawData.endDate;
    this.last_submission_date = null;
    this.status = rawData.status;
    this.assessment_decision = rawData.assessmentDecision;
    this.candidate_average_score = Number(rawData.candidateAverageScore);
    this.group_average_score = Number(rawData.groupAverageScore);
  }
}
