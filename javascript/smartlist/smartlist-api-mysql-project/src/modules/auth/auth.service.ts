import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedToken } from 'src/entities/authorized-token.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { Role } from 'src/enums/role';
import { CryptoService } from 'src/providers/crypto.service';

import { User } from '../../entities/user.entity';
import { CandidateRepository } from '../candidate/candidate.repository';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from './auth.repository';
import { AuthResponseCodes } from './auth.response.codes';
import { AuthReqDto } from './dto/request/auth.req.dto';
import { JWTPayload } from './dto/request/jwt.payload';
import { AuthRespDto } from './dto/response/auth.resp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    @InjectRepository(CandidateRepository)
    private candidateRepository: CandidateRepository,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersRepository.findByEmailWithOrganization(
      email,
    );

    if (user == null) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else if (user.active == false) {
      throw AuthResponseCodes.USER_ACCOUNT_INACTIVE;
    }

    const isPasswordCorrect: boolean = await this.cryptoService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else {
      return user;
    }
  }

  async validateAccessToken(payload: any) {
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify({
        email: payload.email,
        sub: payload.sub,
        role: payload.role,
      }),
    );

    const authorizedToken: AuthorizedToken =
      await this.authRepository.findByAccessToken(accessTokenHash);
    if (authorizedToken == null) {
      throw AuthResponseCodes.ACCESS_TOKEN_INVALID;
    }
  }

  async loginUser(authReqDto: AuthReqDto): Promise<AuthRespDto> {
    const user = await this.validateUser(authReqDto.email, authReqDto.password);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify(payload),
    );

    const authorizedToken: AuthorizedToken = new AuthorizedToken();
    authorizedToken.access_token_hash = accessTokenHash;
    authorizedToken.refresh_token_hash = '';
    authorizedToken.user = user;
    await this.authRepository.deleteByUser(user);
    await this.authRepository.save(authorizedToken);

    const authRespDto: AuthRespDto = new AuthRespDto(user.id, accessToken);

    return authRespDto;
  }

  async loginCandidate(candidate: Candidate): Promise<AuthRespDto> {
    const payload = {
      email: candidate.email,
      sub: candidate.id,
      role: Role.CANDIDATE,
    };

    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify(payload),
    );

    const authorizedToken: AuthorizedToken = new AuthorizedToken();
    authorizedToken.access_token_hash = accessTokenHash;
    authorizedToken.refresh_token_hash = '';
    authorizedToken.candidate = candidate;
    await this.authRepository.deleteByCandidate(candidate);
    await this.authRepository.save(authorizedToken);

    const authRespDto: AuthRespDto = new AuthRespDto(candidate.id, accessToken);

    return authRespDto;
  }

  async logout(jwtPayload: JWTPayload) {
    if (jwtPayload.role == Role.CANDIDATE) {
      const candidate: Candidate = await this.candidateRepository.findById(
        jwtPayload.sub,
      );
      if (candidate != null) {
        await this.authRepository.deleteByCandidate(candidate);
      }
    } else {
      const user: User = await this.usersRepository.findById(jwtPayload.sub);
      if (user != null) {
        await this.authRepository.deleteByUser(user);
      }
    }
  }
}
