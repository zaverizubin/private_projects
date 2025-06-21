import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AppResponseCodes } from 'src/app.response.codes';

export class OrganizationResponseCodes extends AppResponseCodes {
  public static ORGANIZATION_NAME_EXISTS: any = new BadRequestException(
    'organization with same name exists',
  );

  public static INVALID_ORGANIZATION_ID: any = new NotFoundException(
    'invalid organization id',
  );

  public static INVALID_USER_EMAIL_ID: any = new NotFoundException(
    'invalid user email id',
  );

  public static INVALID_USER_ID: any = new NotFoundException('invalid user id');

  public static INVALID__LOGO_FILE_ID: any = new NotFoundException(
    'invalid logo file id',
  );
}
