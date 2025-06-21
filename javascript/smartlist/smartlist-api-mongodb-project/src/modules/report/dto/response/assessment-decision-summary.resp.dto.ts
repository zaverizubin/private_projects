import { ApiProperty } from '@nestjs/swagger';

export class AssessmentDecisionSummaryRespDto {
  @ApiProperty()
  assessment_id: number;

  @ApiProperty()
  smartlisted: number;

  @ApiProperty()
  shortlisted: number;

  @ApiProperty()
  decision_pending: number;

  @ApiProperty()
  on_hold: number;

  @ApiProperty()
  in_progress: number;

  @ApiProperty()
  grading_pending: number;

  @ApiProperty()
  grading_completed: number;

  @ApiProperty()
  regret: number;

  constructor(rawData: any) {
    this.assessment_id = rawData.assessmentId;
    this.smartlisted = Number(rawData.smartlisted);
    this.shortlisted = Number(rawData.shortlisted);
    this.in_progress = Number(rawData.in_progress);
    this.grading_pending = Number(rawData.grading_pending);
    this.grading_completed = Number(rawData.grading_completed);
    this.decision_pending = Number(rawData.decision_pending);
    this.on_hold = Number(rawData.on_hold);
    this.regret = Number(rawData.regret);
  }
}
