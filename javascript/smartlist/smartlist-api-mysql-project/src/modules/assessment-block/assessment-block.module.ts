import { Module } from '@nestjs/common';
import { AssessmentBlockService } from './assessment-block.service';
import { AssessmentBlockController } from './assessment-block.controller';
import { AssessmentBlockRepository } from './assessment-block.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { AnswerOptionRepository } from '../question/answer-option.repository';
import { QuestionRepository } from '../question/question.repository';

@Module({
  controllers: [AssessmentBlockController],
  imports: [
    TypeOrmModule.forFeature([
      AssessmentRepository,
      AssessmentBlockRepository,
      QuestionRepository,
      AnswerOptionRepository,
    ]),
  ],
  providers: [AssessmentBlockService],
})
export class AssessmentBlockModule {}
