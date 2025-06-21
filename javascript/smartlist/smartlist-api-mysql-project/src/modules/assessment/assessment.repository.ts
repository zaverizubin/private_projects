import { Injectable } from '@nestjs/common';
import { Assessment } from 'src/entities/assessment.entity';
import { Organization } from 'src/entities/organization.entity';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { EntityRepository, Like, Repository } from 'typeorm';

@Injectable()
@EntityRepository(Assessment)
export class AssessmentRepository extends Repository<Assessment> {
  constructor() {
    super();
  }

  async findById(id: number): Promise<Assessment> {
    return this.findOne(id);
  }

  async findByIdWithRelations(id: number, selection = []): Promise<Assessment> {
    let query = {
      relations: ['organization', 'headerImage'],
    };
    if (selection.length > 0) {
      const newQuery = { select: selection, ...query };
      query = newQuery;
    }
    return this.findOne(id, query);
  }

  async findByTokenWithRelations(token: string): Promise<Assessment> {
    const query = {
      where: { token: token },
      relations: ['organization', 'headerImage'],
    };

    return this.findOne(query);
  }

  async findByTokenWithQuestionsRelations(token: string): Promise<Assessment> {
    return this.createQueryBuilder('assessment')
      .innerJoinAndSelect('assessment.organization', 'organization')
      .leftJoinAndSelect('assessment.headerImage', 'headerImage')
      .leftJoinAndSelect('assessment.assessmentBlocks', 'assessmentBlocks')
      .leftJoinAndSelect('assessmentBlocks.questions', 'questions')
      .where('assessment.token = :token', { token: token })
      .getOne();
  }

  async findByIdWithQuestionsRelations(
    questionid: number,
  ): Promise<Assessment> {
    return this.createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.assessmentBlocks', 'assessmentBlocks')
      .leftJoinAndSelect('assessmentBlocks.questions', 'questions')
      .where('questions.id = :id', { id: questionid })
      .getOne();
  }

  async findByIdWithAssessmentBlockRelations(id: number): Promise<Assessment> {
    return this.createQueryBuilder('assessment')
      .innerJoinAndSelect('assessment.organization', 'organization')
      .leftJoinAndSelect('assessment.headerImage', 'headerImage')
      .leftJoinAndSelect('assessment.assessmentBlocks', 'assessmentBlocks')
      .leftJoinAndSelect('assessmentBlocks.questions', 'questions')
      .leftJoinAndSelect('questions.answerOptions', 'answerOption')
      .where('assessment.id = :id', { id: id })
      .getOne();
  }

  async findByTokenWithAssessmentBlocks(token: string): Promise<Assessment> {
    return this.createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.assessmentBlocks', 'assessmentBlocks')
      .orderBy('assessmentBlocks.sortOrder', 'ASC')
      .where('assessment.token = :token', { token: token })
      .getOne();
  }

  async findByIdWithAssessmentBlocks(id: number): Promise<Assessment> {
    return this.createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.assessmentBlocks', 'assessmentBlocks')
      .orderBy('assessmentBlocks.sortOrder', 'ASC')
      .where('assessment.id = :id', { id: id })
      .getOne();
  }

  async findByNameAndOrganization(
    assessmentName: string,
    organization: Organization,
  ): Promise<Assessment> {
    return this.findOne({
      where: { name: assessmentName, organization: organization },
    });
  }

  async findByOrganizationAndStatusWithRelations(
    organization: Organization,
    status: AssessmentStatus,
  ): Promise<Assessment[]> {
    return this.find({
      where: { organization: organization, status: status },
      relations: ['organization', 'headerImage'],
    });
  }

  async findByStatusAndNameForOrganizationWithRelations(
    organization: Organization,
    status: AssessmentStatus,
    name: string,
  ): Promise<Assessment[]> {
    return this.find({
      where: {
        organization: organization,
        status: status,
        name: Like(`%${name}%`),
      },
      relations: ['organization', 'headerImage'],
    });
  }

  async findByOrganization(organization: Organization): Promise<Assessment[]> {
    return this.find({
      where: { organization: organization },
    });
  }
}
