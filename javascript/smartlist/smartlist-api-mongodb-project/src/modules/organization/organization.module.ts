import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CryptoService } from 'src/providers/crypto.service';
import { EmailService } from 'src/providers/email.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from 'src/schemas/organization.schema';
import { AssetFile } from 'src/entities/asset-file.entity';
import { AssetFileSchema } from 'src/schemas/asset-file.schema';
import { OrganizationDocumentRepository } from './organization.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { UserDocumentRepository } from '../user/user.document.repository';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserInvite, UserInviteSchema } from 'src/schemas/user-invite.schema';
import { UserInviteDocumentRepository } from '../user/user.invite.document.repository';
import { EmailLog, EmailLogSchema } from 'src/schemas/email-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
      { name: UserInvite.name, schema: UserInviteSchema },
      { name: AssetFile.name, schema: AssetFileSchema },
      { name: EmailLog.name, schema: EmailLogSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    CryptoService,
    EmailService,
    DBConnectionService,
    OrganizationDocumentRepository,
    AssetFileDocumentRepository,
    UserDocumentRepository,
    UserInviteDocumentRepository,
  ],
})
export class OrganizationModule {}
