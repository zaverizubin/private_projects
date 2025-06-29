import { BadRequestException } from '@nestjs/common';

export class AppResponseCodes {
  public static SUCCESS: any = {
    status: 200,
    description: 'success',
  };

  public static CREATED: any = {
    status: 201,
    description: 'created',
  };

  public static INVALID_ID: any = new BadRequestException(
    'Malformed Document Id',
  );

  public static BAD_REQUEST: any = new BadRequestException('bad request');
}
