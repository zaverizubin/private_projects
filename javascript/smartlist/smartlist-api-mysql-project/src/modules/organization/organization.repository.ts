import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Organization } from 'src/entities/organization.entity';

@Injectable()
@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  constructor() {
    super();
  }

  async findByIdWithRelations(organizationId: number): Promise<Organization> {
    return this.findOne({
      where: { id: organizationId },
      relations: ['logo'],
    });
  }

  async findWithRelations(): Promise<Organization[]> {
    return this.find({
      relations: ['logo'],
    });
  }

  async findById(id: number): Promise<Organization> {
    return this.findOne(id);
  }
}
