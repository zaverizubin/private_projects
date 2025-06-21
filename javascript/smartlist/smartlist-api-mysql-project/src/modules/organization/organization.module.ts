import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { UserRepository } from '../user/user.repository';
import { FileRepository } from '../file/file.repository';
import { UserEmailInviteRepository } from '../user/user.email.invite.repository';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import DBConnectionService from 'src/providers/db.connection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationRepository,
      UserRepository,
      UserEmailInviteRepository,
      FileRepository,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    CryptoService,
    EmailService,
    DBConnectionService,
  ],
})
export class OrganizationModule {}
