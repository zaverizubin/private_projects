import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class UserResponseCodes extends AppResponseCodes {
  public static USER_EMAIL_ID_EXISTS: any = new BadRequestException(
    'user with email already exists',
  );

  public static USER_EMAIL_ALREADY_VERIFIED: any = new BadRequestException(
    'user email already verified',
  );

  public static TOKEN_EXPIRED: any = new BadRequestException('token expired');

  public static INVALID_TOKEN: any = new NotFoundException('token invalid');

  public static INVALID_USER_ID: any = new NotFoundException('invalid user id');

  public static INVALID_USER_ID_OR_PASSWORD: any = new NotFoundException(
    'invalid user id or password',
  );

  public static INVALID_USER_EMAIL_ID: any = new NotFoundException(
    'invalid user email id',
  );

  public static INVALID_ORGANIZATION_ID: any = new NotFoundException(
    'invalid organization id',
  );

  public static INVALID__PROFILE_PHOTO_FILE_ID: any = new NotFoundException(
    'invalid profile photo file id',
  );
}
