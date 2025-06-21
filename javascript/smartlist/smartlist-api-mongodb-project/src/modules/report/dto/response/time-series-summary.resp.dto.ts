import { ApiProperty } from '@nestjs/swagger';
import { TimeSeriesDataRespDto } from './time-series-data.resp.dto';

export class TimeSeriesSummaryRespDto {
  @ApiProperty()
  attempts: TimeSeriesDataRespDto[];

  @ApiProperty()
  submissions: TimeSeriesDataRespDto[];

  constructor(
    attempts: TimeSeriesDataRespDto[],
    submissions: TimeSeriesDataRespDto[],
  ) {
    this.attempts = attempts;
    this.submissions = submissions;
  }
}
