import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question, QuestionSchema } from 'src/schemas/question.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionDocumentRepository } from './question.document.repository';
import {
  AssessmentBlock,
  AssessmentBlockSchema,
} from 'src/schemas/assessment-block.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import {
  AnswerOption,
  AnswerOptionSchema,
} from 'src/schemas/answer-option.schema';
import { AnswerOptionDocumentRepository } from './answer-option.document.repository';
import { Assessment, AssessmentSchema } from 'src/schemas/assessment.schema';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { CandidateAssessment, CandidateAssessmentSchema } from 'src/schemas/candidate-assessment.schema';

@Module({
  controllers: [QuestionController],
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: AnswerOption.name, schema: AnswerOptionSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentBlock.name, schema: AssessmentBlockSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: CandidateAssessment.name, schema: CandidateAssessmentSchema },

    ]),
  ],
  providers: [
    QuestionService,
    QuestionDocumentRepository,
    AnswerOptionDocumentRepository,
    AssessmentDocumentRepository,
    AssessmentBlockDocumentRepository,
    CandidateDocumentRepository,
    CandidateAssessmentDocumentRepository,
  ],
})
export class QuestionModule { }
