import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserEmailVerification } from 'src/entities/user-email-verification.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(UserEmailVerification)
export class UserEmailVerificationRepository extends Repository<UserEmailVerification> {
  async insertVerifyEmailEntry(
    user: User,
    token: string,
  ): Promise<UserEmailVerification> {
    const userEmailVerification: UserEmailVerification = new UserEmailVerification();
    userEmailVerification.user = user;
    userEmailVerification.token = token;
    return await this.save(userEmailVerification);
  }

  async findByToken(verifyToken: string): Promise<UserEmailVerification> {
    return await this.findOne({
      where: { token: verifyToken },
      relations: ['user'],
    });
  }

  async deleteByToken(tokenToRemove: string) {
    await this.delete({ token: tokenToRemove });
  }

  async deleteByUser(user: User) {
    await this.delete({ user: user });
  }
}
