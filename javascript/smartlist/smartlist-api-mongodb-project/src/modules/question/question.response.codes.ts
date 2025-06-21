import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class QuestionResponseCodes extends AppResponseCodes {
  public static ASSESSMENT_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment state',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID: any = new BadRequestException(
    'invalid assessment block id',
  );

  public static INVALID_CANDIDATE_ID: any = new BadRequestException(
    'invalid candidate id',
  );

  public static INVALID_QUESTION_TYPE: any = new BadRequestException(
    'invalid question type',
  );

  public static INVALID_QUESTION_ID_LIST: any = new BadRequestException(
    'invalid question id list',
  );

  public static INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE: any =
    new BadRequestException('invalid answer options for question type');

  public static INVALID_SCORE: any = new BadRequestException(
    'invalid answer options score for question type',
  );

  public static INVALID_ANSWER_OPTION: any = new BadRequestException(
    'invalid correct answer option(s) for question type',
  );

  public static INVALID_QUESTION_OPTION: any = new BadRequestException(
    'invalid question option(s) for question type',
  );

  public static INVALID_QUESTION_ID: any = new NotFoundException(
    'invalid question id',
  );
}
