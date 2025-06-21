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
  onHold: number;

  @ApiProperty()
  inProgress: number;

  @ApiProperty()
  gradingPending: number;

  @ApiProperty()
  gradingCompleted: number;

  @ApiProperty()
  regret: number;

  constructor(rawData: any) {
    this.assessment_id = rawData.assessmentId;
    this.smartlisted = Number(rawData.smartlisted);
    this.shortlisted = Number(rawData.shortlisted);
    this.inProgress = Number(rawData.inProgress);
    this.gradingPending = Number(rawData.gradingPending);
    this.gradingCompleted = Number(rawData.gradingCompleted);
    this.decision_pending = Number(rawData.decisionPending);
    this.onHold = Number(rawData.onHold);
    this.regret = Number(rawData.regret);
  }
}
