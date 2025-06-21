import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CryptoService } from 'src/providers/crypto.service';
import { jwtConfig } from 'src/config/jwt.config';
import { LocalStrategy } from './local.strategy';
import { AuthorizedTokenDocumentRepository } from './authorized.token.document.repository';
import { AuthorizedToken, AuthorizedTokenSchema } from 'src/schemas/authorized-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserDocumentRepository } from '../user/user.document.repository';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    UserModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: AuthorizedToken.name, schema: AuthorizedTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    CryptoService,
    AuthorizedTokenDocumentRepository,
    UserDocumentRepository,
    CandidateDocumentRepository,],
})
export class AuthModule { }
