import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from 'src/providers/crypto.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { EmailService } from 'src/providers/email.service';
import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { EmailLog, EmailLogSchema } from 'src/schemas/email-log.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/schemas/organization.schema';
import { UserInvite, UserInviteSchema } from 'src/schemas/user-invite.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { UserController } from './user.controller';
import { UserDocumentRepository } from './user.document.repository';
import { UserInviteDocumentRepository } from './user.invite.document.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserInvite.name, schema: UserInviteSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: AssetFile.name, schema: AssetFileSchema },
      { name: EmailLog.name, schema: EmailLogSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    CryptoService,
    EmailService,
    DBConnectionService,
    UserDocumentRepository,
    OrganizationDocumentRepository,
    AssetFileDocumentRepository,
    UserInviteDocumentRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
