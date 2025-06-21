import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradingRepository } from './grading.repository';
import { CandidateRepository } from '../candidate/candidate.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { QuestionRepository } from '../question/question.repository';
import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { QuestionCommentRepository } from './question-comment.repository';
import { CandidateResponseRepository } from '../candidate/candidate.response.repository';

@Module({
  controllers: [GradingController],
  imports: [
    TypeOrmModule.forFeature([
      GradingRepository,
      CandidateRepository,
      AssessmentRepository,
      AssessmentBlockRepository,
      QuestionRepository,
      CandidateAssessmentRepository,
      QuestionCommentRepository,
      CandidateResponseRepository,
    ]),
  ],
  providers: [GradingService],
})
export class GradingModule {}
