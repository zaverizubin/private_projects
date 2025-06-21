import { ApiProperty } from '@nestjs/swagger';

export class AssessmentSummaryRespDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  active_since: Date;

  @ApiProperty()
  registered: number;

  @ApiProperty()
  completed: number;

  @ApiProperty()
  smartlisted: number;

  constructor(rawData: any) {
    this.id = Number(rawData.id);
    this.title = rawData.title;
    this.department = rawData.department;
    this.active_since = rawData.activeSince;
    this.registered = Number(rawData.registered);
    this.completed = Number(rawData.completed);
    this.smartlisted = Number(rawData.smartlisted);
  }
}
