import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from 'src/providers/crypto.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { EmailService } from 'src/providers/email.service';
import { FileRepository } from '../file/file.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { UserController } from './user.controller';
import { UserEmailInviteRepository } from './user.email.invite.repository';
import { UserEmailVerificationRepository } from './user.email.verification.repository';
import { UserForgotPasswordRepository } from './user.forgot.password.repository';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserEmailInviteRepository,
      UserEmailVerificationRepository,
      UserForgotPasswordRepository,
      OrganizationRepository,
      FileRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, CryptoService, EmailService, DBConnectionService],
  exports: [UserService],
})
export class UserModule {}
