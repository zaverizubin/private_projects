import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class GradingResponseCodes extends AppResponseCodes {
  public static ASSESSMENT_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment state',
  );

  public static INVALID_ASSESSMENT_DECISION: any = new BadRequestException(
    'invalid assessment decision',
  );

  public static CANDIDATE_ASSESSMENT_ACTION_DENIED: any =
    new BadRequestException('action invalid for candidate assessment state');

  public static CANDIDATE_ASSESSMENT_SCORING_PENDING: any =
    new BadRequestException('all questions are required to be scored');

  public static CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS: any =
    new NotFoundException('candidate assessment does not exists');

  public static INVALID_CANDIDATE_ID: any = new NotFoundException(
    'invalid candidate id',
  );

  public static INVALID_ASSESSMENT_ID: any = new NotFoundException(
    'invalid assessment id',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID: any = new NotFoundException(
    'invalid assessment block id',
  );

  public static INVALID_QUESTION_ID: any = new NotFoundException(
    'invalid question id',
  );

  public static INVALID_CANDIDATE_ASSESSMENT_ID: any = new NotFoundException(
    'invalid candidate assessment id',
  );
}
