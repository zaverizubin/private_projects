import { ApiProperty } from '@nestjs/swagger';

export class RateSummaryRespDto {
  @ApiProperty()
  response_rate: number;

  @ApiProperty()
  qualification_rate: number;

  @ApiProperty()
  smartlist_rate: number;

  @ApiProperty()
  registration_count: number;

  constructor(
    responseRate: number,
    qualificationRate: number,
    smartlistRate: number,
    registrationCount: number,
  ) {
    this.response_rate = responseRate;
    this.qualification_rate = qualificationRate;
    this.smartlist_rate = smartlistRate;
    this.registration_count = registrationCount;
  }
}
