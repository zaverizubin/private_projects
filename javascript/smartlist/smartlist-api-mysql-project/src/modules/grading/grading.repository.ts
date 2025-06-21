import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';

@Injectable()
@EntityRepository(CandidateResponseScore)
export class GradingRepository extends Repository<CandidateResponseScore> {
  constructor() {
    super();
  }

  getCountForCandidateByAssessment(
    candidate: Candidate,
    assessment: Assessment,
  ): Promise<number> {
    return this.count({
      where: { candidate: candidate, assessment: assessment },
    });
  }

  getForCandidateByAssessment(
    candidate: Candidate,
    assessment: Assessment,
  ): Promise<CandidateResponseScore[]> {
    return this.find({
      where: { candidate: candidate, assessment: assessment },
      relations: ['candidate', 'assessment', 'assessmentBlock', 'question'],
    });
  }

  getForCandidateByAssessmentBlock(
    candidate: Candidate,
    assessmentBlock: AssessmentBlock,
  ): Promise<CandidateResponseScore[]> {
    return this.find({
      where: { candidate: candidate, assessmentBlock: assessmentBlock },
      relations: ['candidate', 'assessment', 'assessmentBlock', 'question'],
    });
  }
}
