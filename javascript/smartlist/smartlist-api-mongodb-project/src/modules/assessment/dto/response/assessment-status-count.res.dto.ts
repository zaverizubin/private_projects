import { ApiProperty } from '@nestjs/swagger';

export class AssessmentStatusCountRespDto {
  @ApiProperty()
  active: number;

  @ApiProperty()
  archived: number;

  @ApiProperty()
  drafts: number;

  constructor(active: number, archived: number, drafts: number) {
    this.active = active;
    this.archived = archived;
    this.drafts = drafts;
  }
}
