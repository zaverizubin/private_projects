import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { AnswerOptionRepository } from './answer-option.repository';
import { QuestionRepository } from './question.repository';

@Module({
  controllers: [QuestionController],
  imports: [
    TypeOrmModule.forFeature([
      AssessmentBlockRepository,
      QuestionRepository,
      AnswerOptionRepository,
    ]),
  ],
  providers: [QuestionService],
})
export class QuestionModule {}
