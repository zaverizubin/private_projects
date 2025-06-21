import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { Question } from 'src/entities/question.entity';
import { AssessmentBlockSchema } from 'src/schemas/assessment-block.schema';
import { AssessmentSchema } from 'src/schemas/assessment.schema';
import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { CandidateAssessment, CandidateAssessmentSchema } from 'src/schemas/candidate-assessment.schema';
import { CandidateResponse, CandidateResponseSchema } from 'src/schemas/candidate-response.schema';
import { QuestionSchema } from 'src/schemas/question.schema';
import { CandidateResponseScore, CandidateResponseScoreSchema } from 'src/schemas/candidate-response-score.schema';
import { QuestionComment, QuestionCommentSchema } from 'src/schemas/question-comment.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateResponseDocumentRepository } from '../candidate/candidate-response.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { CandidateResponseScoreDocumentRepository } from './candidate-response-score.document.repository';
import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { QuestionCommentDocumentRepository } from './question-comment.document.repository';

@Module({
  controllers: [GradingController],
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentBlock.name, schema: AssessmentBlockSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: CandidateAssessment.name, schema: CandidateAssessmentSchema },
      { name: CandidateResponse.name, schema: CandidateResponseSchema },
      { name: CandidateResponseScore.name, schema: CandidateResponseScoreSchema },
      { name: QuestionComment.name, schema: QuestionCommentSchema },
      { name: AssetFile.name, schema: AssetFileSchema },
    ]),
  ],
  providers: [
    AssessmentDocumentRepository,
    AssessmentBlockDocumentRepository,
    QuestionDocumentRepository,
    CandidateDocumentRepository,
    CandidateAssessmentDocumentRepository,
    CandidateResponseDocumentRepository,
    CandidateResponseScoreDocumentRepository,
    QuestionCommentDocumentRepository,
    AssetFileDocumentRepository,
    GradingService],
})
export class GradingModule { }
