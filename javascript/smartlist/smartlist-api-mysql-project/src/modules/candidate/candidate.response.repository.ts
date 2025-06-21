import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { CandidateResponse } from 'src/entities/candidate-response.entity';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { Question } from 'src/entities/question.entity';

@Injectable()
@EntityRepository(CandidateResponse)
export class CandidateResponseRepository extends Repository<CandidateResponse> {
  constructor() {
    super();
  }

  async findByCandidateAssessmentAndQuestionWithRelations(
    candidateAssessment: CandidateAssessment,
    question: Question,
  ): Promise<CandidateResponse[]> {
    return this.find({
      where: { candidateAssessment: candidateAssessment, question: question },
      relations: ['file', 'question'],
      order: {
        question: 'ASC',
      },
    });
  }

  async findCountByCandidateAssessment(
    candidateAssessment: CandidateAssessment,
  ): Promise<number> {
    return this.count({
      where: { candidateAssessment: candidateAssessment },
    });
  }
}
