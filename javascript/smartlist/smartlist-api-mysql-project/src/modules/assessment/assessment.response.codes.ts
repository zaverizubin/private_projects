import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class AssessmentResponseCodes extends AppResponseCodes {
  public static ASSESSMENT_NAME_EXISTS: any = new BadRequestException(
    'assessment with same name exists',
  );

  public static ASSESSMENT_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment state',
  );

  public static INVALID_ASSESSMENT_STATUS: any = new NotFoundException(
    'invalid assessment status',
  );

  public static INVALID_ASSESSMENT_BLOCK_COUNT: any = new BadRequestException(
    'assessment block count must be > 0',
  );

  public static INVALID_QUESTION_COUNT: any = new BadRequestException(
    'assessment block question count must be > 0',
  );

  public static INVALID_ASSESSMENT_ID: any = new NotFoundException(
    'invalid assessment id',
  );

  public static INVALID_ASSESSMENT_TOKEN: any = new NotFoundException(
    'invalid assessment token',
  );

  public static INVALID_HEADER_FILE_ID: any = new NotFoundException(
    'invalid header file id',
  );

  public static INVALID_ORGANIZATION_ID: any = new NotFoundException(
    'invalid organization id',
  );
}
