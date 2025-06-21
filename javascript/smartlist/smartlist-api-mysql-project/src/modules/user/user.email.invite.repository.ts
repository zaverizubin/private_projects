import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEmailInvite } from 'src/entities/user-email-invite.entity';

@Injectable()
@EntityRepository(UserEmailInvite)
export class UserEmailInviteRepository extends Repository<UserEmailInvite> {
  async findByTokenWithOrganization(
    verifyToken: string,
  ): Promise<UserEmailInvite> {
    return await this.findOne({
      where: { token: verifyToken },
      relations: ['organization'],
    });
  }

  async deleteByToken(tokenToRemove: string) {
    await this.delete({ token: tokenToRemove });
  }
}
