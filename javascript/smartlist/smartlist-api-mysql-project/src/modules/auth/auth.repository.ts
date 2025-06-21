import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuthorizedToken } from 'src/entities/authorized-token.entity';
import { User } from 'src/entities/user.entity';
import { Candidate } from 'src/entities/candidate.entity';

@Injectable()
@EntityRepository(AuthorizedToken)
export class AuthRepository extends Repository<AuthorizedToken> {
  async findByAccessToken(accessTokenHash: string): Promise<AuthorizedToken> {
    return await this.findOne({
      where: { access_token_hash: accessTokenHash },
    });
  }

  async deleteByUser(user: User) {
    await this.delete({ user: user });
  }

  async deleteByCandidate(candidate: Candidate) {
    await this.delete({ candidate: candidate });
  }
}
