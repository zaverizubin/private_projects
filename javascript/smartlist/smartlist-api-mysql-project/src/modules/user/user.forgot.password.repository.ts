import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserEmailVerification } from 'src/entities/user-email-verification.entity';
import { Injectable } from '@nestjs/common';
import { UserForgotPassword } from 'src/entities/user-forgot-password.entity';

@Injectable()
@EntityRepository(UserForgotPassword)
export class UserForgotPasswordRepository extends Repository<UserForgotPassword> {
  async insertForgotPasswordEntry(
    user: User,
    token: string,
  ): Promise<UserForgotPassword> {
    const userForgotPassword: UserForgotPassword = new UserForgotPassword();
    userForgotPassword.user = user;
    userForgotPassword.token = token;
    return await this.save(userForgotPassword);
  }

  async findByUser(user: User): Promise<UserForgotPassword> {
    return await this.findOne({
      where: { user: user },
    });
  }

  async findByToken(forgotPasswordToken: string): Promise<UserForgotPassword> {
    return await this.findOne({
      where: { token: forgotPasswordToken },
      relations: ['user'],
    });
  }

  async deleteByToken(tokenToRemove: string) {
    await this.delete({ token: tokenToRemove });
  }
}
