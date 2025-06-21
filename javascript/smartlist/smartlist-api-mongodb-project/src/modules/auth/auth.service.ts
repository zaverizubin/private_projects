import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums/role';
import { CryptoService } from 'src/providers/crypto.service';
import { AuthorizedTokenDocument } from 'src/schemas/authorized-token.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { UserDocument } from 'src/schemas/user.schema';

import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { UserDocumentRepository } from '../user/user.document.repository';
import { AuthResponseCodes } from './auth.response.codes';
import { AuthorizedTokenDocumentRepository } from './authorized.token.document.repository';
import { AuthReqDto } from './dto/request/auth.req.dto';
import { JWTPayload } from './dto/request/jwt.payload';
import { AuthRespDto } from './dto/response/auth.resp.dto';

@Injectable()
export class AuthService {
  constructor(
    private candidateDocumentRepository: CandidateDocumentRepository,
    private userDocumentRepository: UserDocumentRepository,
    private authorizedTokenDocumentRepository: AuthorizedTokenDocumentRepository,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const userDocument: UserDocument = await this.userDocumentRepository.findByEmail(
      email,
    );

    if (userDocument == null) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else if (userDocument.active == false) {
      throw AuthResponseCodes.USER_ACCOUNT_INACTIVE;
    }

    const isPasswordCorrect: boolean = await this.cryptoService.comparePassword(
      password,
      userDocument.password,
    );
    if (!isPasswordCorrect) {
      throw AuthResponseCodes.USER_CREDENTIALS_INVALID;
    } else {
      return userDocument;
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

    const authorizedTokenDocument: AuthorizedTokenDocument =
      await this.authorizedTokenDocumentRepository.findByAccessToken(accessTokenHash);
    if (authorizedTokenDocument == null) {
      throw AuthResponseCodes.ACCESS_TOKEN_INVALID;
    }
  }

  async loginUser(authReqDto: AuthReqDto): Promise<AuthRespDto> {

    const userDocument: UserDocument = await this.validateUser(authReqDto.email, authReqDto.password);

    const payload = {
      email: userDocument.email,
      sub: userDocument.id,
      role: userDocument.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify(payload),
    );

    const authorizedTokenDocument: AuthorizedTokenDocument = this.authorizedTokenDocumentRepository.getModelInstance()
    authorizedTokenDocument.access_token_hash = accessTokenHash;
    authorizedTokenDocument.userDocument = userDocument;
    await this.deleteAuthorizedTokenForUser(userDocument);
    await this.authorizedTokenDocumentRepository.save(authorizedTokenDocument);

    const authRespDto: AuthRespDto = new AuthRespDto(userDocument.id, accessToken);

    return authRespDto;
  }

  async loginCandidate(candidateDocument: CandidateDocument): Promise<AuthRespDto> {
    const payload = {
      email: candidateDocument.email,
      sub: candidateDocument.id,
      role: Role.CANDIDATE,
    };

    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = this.cryptoService.generateHash(
      JSON.stringify(payload),
    );

    const authorizedTokenDocument: AuthorizedTokenDocument = this.authorizedTokenDocumentRepository.getModelInstance();
    authorizedTokenDocument.access_token_hash = accessTokenHash;
    authorizedTokenDocument.candidateDocument = candidateDocument;

    await this.deleteAuthorizedTokenForCandidate(candidateDocument);
    await this.authorizedTokenDocumentRepository.save(authorizedTokenDocument);

    const authRespDto: AuthRespDto = new AuthRespDto(candidateDocument.id, accessToken);

    return authRespDto;
  }

  async logout(jwtPayload: JWTPayload) {
    if (jwtPayload.role == Role.CANDIDATE) {
      const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(
        jwtPayload.sub,
      );
      await this.deleteAuthorizedTokenForCandidate(candidateDocument);

    } else {
      const userDocument: UserDocument = await this.userDocumentRepository.findById(jwtPayload.sub);
      await this.deleteAuthorizedTokenForUser(userDocument);
    }
  }

  private async deleteAuthorizedTokenForCandidate(candidateDocument: CandidateDocument) {
    const authorizedTokenDocument: AuthorizedTokenDocument = await this.authorizedTokenDocumentRepository.findByCandidate(candidateDocument);
    if (authorizedTokenDocument != null) {
      await this.authorizedTokenDocumentRepository.delete(authorizedTokenDocument);
    }
  }

  private async deleteAuthorizedTokenForUser(userDocument: UserDocument) {
    const authorizedTokenDocument: AuthorizedTokenDocument = await this.authorizedTokenDocumentRepository.findByUser(userDocument);
    if (authorizedTokenDocument != null) {
      await this.authorizedTokenDocumentRepository.delete(authorizedTokenDocument);
    }
  }

}
