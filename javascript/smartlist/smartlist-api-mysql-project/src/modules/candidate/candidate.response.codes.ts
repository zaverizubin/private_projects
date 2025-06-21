import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class CandidateResponseCodes extends AppResponseCodes {
  public static CANDIDATE_EXISTS: any = new BadRequestException(
    'candidate exists',
  );

  public static CANDIDATE_EMAIL_EXISTS: any = new BadRequestException(
    'candidate email exists',
  );

  public static CANDIDATE_ALREADY_VERIFIED: any = new BadRequestException(
    'candidate already verified',
  );

  public static CANDIDATE_ASSESSMENT_EXISTS: any = new BadRequestException(
    'candidate assessment exists',
  );

  public static ASSESSMENT_ACTION_DENIED: any = new BadRequestException(
    'action invalid for assessment state',
  );

  public static CANDIDATE_ASSESSMENT_ACTION_DENIED: any =
    new BadRequestException('action invalid for candidate assessment state');

  public static ASSESSMENT_BLOCK_QUESTION_MISMATCH: any =
    new BadRequestException('question not from active assessment block');

  public static CANDIDATE_ASSESSMENT_TIMED_OUT: any = new BadRequestException(
    'candidate assessment timed out',
  );

  public static ANSWER_RESPONSE_INCORRECT: any = new BadRequestException(
    'incorrect answer response',
  );

  public static INVALID_ORGANIZATION_ID: any = new NotFoundException(
    'invalid organization id',
  );

  public static INVALID_CANDIDATE_ID: any = new NotFoundException(
    'invalid candidate id',
  );

  public static INVALID_ASSESSMENT_ID: any = new NotFoundException(
    'invalid assessment id',
  );

  public static INVALID_CANDIDATE_CONTACT_NUMBER: any = new NotFoundException(
    'invalid candidate contact number',
  );

  public static INVALID_VERIFICATION_CODE: any = new NotFoundException(
    'invalid candidate verification code',
  );

  public static INVALID_ASSESSMENT_TOKEN: any = new NotFoundException(
    'invalid assessment token',
  );

  public static CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS: any =
    new NotFoundException('candidate assessment does not exists');

  public static INVALID_CANDIDATE_ASSESSMENT_ID: any = new NotFoundException(
    'invalid candidate assessment id',
  );

  public static INVALID_ASSESSMENT_BLOCK_ID: any = new NotFoundException(
    'invalid assessment block id',
  );

  public static INVALID_QUESTION_ID: any = new NotFoundException(
    'invalid question id',
  );

  public static INVALID_ANSWER_ID: any = new NotFoundException(
    'invalid answer id(s)',
  );

  public static INVALID_PHOTO_FILE_ID: any = new NotFoundException(
    'invalid photo file id',
  );

  public static INVALID_VIDEO_FILE_ID: any = new NotFoundException(
    'invalid video file id',
  );

  public static INVALID_FILE_ID: any = new NotFoundException('invalid file id');
}
