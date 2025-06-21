import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class AssessmentBlockResponseCodes extends AppResponseCodes {
  public static ASSESSMENT_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment state',
  );

  public static ASSESSMENT_BLOCK_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment block state',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID_LIST: any = new BadRequestException(
    'invalid assessment block id list',
  );

  public static INVALID_QUESTION_NUMBER: any = new BadRequestException(
    'invalid question numbers for randomize option',
  );

  public static INVALID_ASSESSMENT_ID: any = new NotFoundException(
    'invalid assessment id',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID: any = new NotFoundException(
    'invalid assessment block id',
  );
}
