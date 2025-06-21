import { EntityRepository, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { QuestionComment } from 'src/entities/question-comment.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { Question } from 'src/entities/question.entity';

@Injectable()
@EntityRepository(QuestionComment)
export class QuestionCommentRepository extends Repository<QuestionComment> {
  constructor() {
    super();
  }

  getForCandidateQuestionAndUsername(
    candidate: Candidate,
    question: Question,
    username: string,
  ): Promise<QuestionComment> {
    return this.findOne({
      where: { candidate: candidate, question: question, username: username },
    });
  }

  findAllForCandidateQuestion(
    candidate: Candidate,
    question: Question,
  ): Promise<QuestionComment[]> {
    return this.find({
      where: { candidate: candidate, question: question },
    });
  }

  findByCandidateAndAssessment(
    candidateId: number,
    assessmentId: number,
  ): Promise<QuestionComment[]> {
    return this.createQueryBuilder('question_comment')
      .innerJoinAndSelect('question_comment.question', 'question')
      .innerJoin('question.assessmentBlock', 'assessmentBlock')
      .innerJoin('assessmentBlock.assessment', 'assessment')
      .where('assessment.id = :id', { id: assessmentId })
      .orderBy('question_comment.modifiedAt')
      .andWhere('question_comment.candidate_id = :candidate_id', {
        candidate_id: candidateId,
      })
      .getMany();
  }
}
