import { ApiProperty } from '@nestjs/swagger';
import { getDateFromISOFormattedDate } from 'src/utils/date.utils';

export class TimeSeriesDataRespDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  count: number;

  constructor(rawData: any) {
    this.date = getDateFromISOFormattedDate(rawData.date);
    this.count = rawData.count;
  }
}
