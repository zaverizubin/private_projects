import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  async findById(id: number): Promise<User> {
    return this.findOne(id, { relations: ['photo', 'organization'] });
  }

  async findByEmail(userEmail: string): Promise<User> {
    return this.findOne({
      where: { email: userEmail },
    });
  }

  async findByEmailWithOrganization(userEmail: string): Promise<User> {
    return this.findOne({
      where: { email: userEmail },
      relations: ['organization', 'photo'],
    });
  }

  async activateUser(userId: number): Promise<void> {
    this.update(userId, {
      active: true,
    });
  }
}
