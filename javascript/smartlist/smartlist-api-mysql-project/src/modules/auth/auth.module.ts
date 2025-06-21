import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { CryptoService } from 'src/providers/crypto.service';
import { jwtConfig } from 'src/config/jwt.config';
import { LocalStrategy } from './local.strategy';
import { AuthRepository } from './auth.repository';
import { CandidateRepository } from '../candidate/candidate.repository';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([
      AuthRepository,
      UserRepository,
      CandidateRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService, CryptoService],
})
export class AuthModule {}
