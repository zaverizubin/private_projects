import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Candidate } from 'src/entities/candidate.entity';
import { Organization } from 'src/entities/organization.entity';

@Injectable()
@EntityRepository(Candidate)
export class CandidateRepository extends Repository<Candidate> {
  constructor() {
    super();
  }

  async findById(id: number): Promise<Candidate> {
    const query = {
      where: { id: id },
      relations: ['photo'],
    };

    return this.findOne(query);
  }

  async findByContactNumber(contactNumber: string): Promise<Candidate> {
    return this.findOne({
      where: { contactNumber: contactNumber },
      relations: ['photo'],
    });
  }

  async findByEmail(email: string): Promise<Candidate> {
    return this.findOne({
      where: { email: email },
    });
  }

  async findByNameForOrganization(
    organization: Organization,
    name: string,
  ): Promise<Candidate[]> {
    return this.createQueryBuilder('candidate')
      .select('candidate')
      .leftJoinAndSelect('candidate.photo', 'photo')
      .innerJoin('candidate.candidateAssessments', 'candidateAssessments')
      .innerJoin('candidateAssessments.assessment', 'assessment')
      .innerJoin('assessment.organization', 'organization')
      .where('organization.id = :id', { id: organization.id })
      .andWhere('candidate.name like :name', { name: '%' + name + '%' })
      .distinctOn(['candidate.id'])
      .getMany();
  }
}
