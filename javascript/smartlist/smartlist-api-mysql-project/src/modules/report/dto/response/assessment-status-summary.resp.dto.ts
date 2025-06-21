import { ApiProperty } from '@nestjs/swagger';

export class AssessmentStatusSummaryRespDto {
  @ApiProperty()
  in_progress: number;

  @ApiProperty()
  completed: number;

  @ApiProperty()
  screened: number;

  constructor(inProgress: number, completed: number, screened: number) {
    this.in_progress = inProgress;
    this.completed = completed;
    this.screened = screened;
  }
}
