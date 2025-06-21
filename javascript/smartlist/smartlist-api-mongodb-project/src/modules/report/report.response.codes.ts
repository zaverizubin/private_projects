import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AppResponseCodes } from 'src/app.response.codes';

export class ReportResponseCodes extends AppResponseCodes {
  public static INVALID_DATE: any = new BadRequestException('invalid date');

  public static INVALID_ASSESSMENT_STATUS: any = new BadRequestException(
    'invalid assessment status',
  );

  public static INVALID_CANDIDATE_ID: any = new NotFoundException(
    'invalid candidate id',
  );

  public static INVALID_ORGANIZATION_ID: any = new NotFoundException(
    'invalid organization id',
  );

  public static INVALID_ASSESSMENT_ID: any = new NotFoundException(
    'invalid assessment id',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID: any = new NotFoundException(
    'invalid assessment block id',
  );

  public static CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS: any =
    new NotFoundException('candidate assessment does not exists');
}
