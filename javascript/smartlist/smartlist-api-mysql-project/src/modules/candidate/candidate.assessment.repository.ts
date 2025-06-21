import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';

@Injectable()
@EntityRepository(CandidateAssessment)
export class CandidateAssessmentRepository extends Repository<CandidateAssessment> {
  constructor() {
    super();
  }

  async findByIdWithCandidate(id: number) {
    return await this.findOne({
      where: { id: id },
      relations: ['candidate'],
    });
  }

  async getForCandidateAndAssessment(
    candidate: Candidate,
    assessment: Assessment,
  ) {
    return this.findOne({
      where: { candidate: candidate, assessment: assessment },
    });
  }

  async findByCandidateAndAssessmentWithRelations(
    candidateId: number,
    token: string,
  ): Promise<CandidateAssessment> {
    console.log('');
    return await this.createQueryBuilder('candidateAssessment')
      .innerJoinAndSelect(
        'candidateAssessment.candidate',
        'candidate',
        'candidate.id = :id',
        { id: candidateId },
      )
      .innerJoinAndSelect(
        'candidateAssessment.assessment',
        'assessment',
        'assessment.token = :token',
        { token: token },
      )
      .innerJoinAndSelect(
        'candidateAssessment.assessmentBlock',
        'assessmentBlock',
      )
      .getOne();
  }

  async findByIdWithRelations(id: number): Promise<CandidateAssessment> {
    const query = {
      relations: ['candidate', 'assessment', 'assessmentBlock'],
    };

    return await this.findOne(id, query);
  }

  async findByCandidateWithRelations(
    candidate: Candidate,
  ): Promise<CandidateAssessment> {
    return await this.findOne({
      where: { candidate: candidate },
      relations: ['candidate', 'assessment'],
    });
  }

  async getCountOfCompletedAssessments(
    assessment: Assessment,
  ): Promise<number> {
    return await this.count({
      where: {
        assessment: assessment,
        status: CandidateAssessmentStatus.GRADING_COMPLETED,
      },
    });
  }
}
