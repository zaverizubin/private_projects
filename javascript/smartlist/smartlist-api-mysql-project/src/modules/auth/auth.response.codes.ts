import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class AuthResponseCodes extends AppResponseCodes {
  public static USER_CREDENTIALS_INVALID: any = new BadRequestException(
    'user credentials are invalid',
  );

  public static USER_ACCOUNT_INACTIVE: any = new ForbiddenException(
    'user account is inactive',
  );

  public static USER_ACCOUNT_INVALID: any = new NotFoundException(
    'invalid user account',
  );

  public static ACCESS_TOKEN_INVALID: any = new UnauthorizedException(
    'invalid access token',
  );
}
