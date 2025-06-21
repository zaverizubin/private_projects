import { Module } from '@nestjs/common';
import { AssessmentBlockService } from './assessment-block.service';
import { AssessmentBlockController } from './assessment-block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AssessmentBlock,
  AssessmentBlockSchema,
} from 'src/schemas/assessment-block.schema';
import { Assessment, AssessmentSchema } from 'src/schemas/assessment.schema';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { AssessmentBlockDocumentRepository } from './assessment-block.document.repository';
import { Question, QuestionSchema } from 'src/schemas/question.schema';
import { QuestionDocumentRepository } from '../question/question.document.repository';

@Module({
  controllers: [AssessmentBlockController],
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentBlock.name, schema: AssessmentBlockSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [
    AssessmentBlockService,
    AssessmentDocumentRepository,
    AssessmentBlockDocumentRepository,
    QuestionDocumentRepository,
  ],
})
export class AssessmentBlockModule { }
