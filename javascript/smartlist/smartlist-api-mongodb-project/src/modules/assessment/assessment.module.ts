import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from 'src/providers/crypto.service';
import { FileService } from '../file/file.service';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from 'src/schemas/organization.schema';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { AssessmentDocumentRepository } from './assessment.document.repository';
import { Assessment, AssessmentSchema } from 'src/schemas/assessment.schema';
import {
  AssessmentBlock,
  AssessmentBlockSchema,
} from 'src/schemas/assessment-block.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { Question, QuestionSchema } from 'src/schemas/question.schema';
import { QuestionDocumentRepository } from '../question/question.document.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssetFile.name, schema: AssetFileSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentBlock.name, schema: AssessmentBlockSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),

  ],
  controllers: [AssessmentController],
  providers: [
    AssessmentService,
    FileService,
    CryptoService,
    AssetFileDocumentRepository,
    OrganizationDocumentRepository,
    AssessmentDocumentRepository,
    AssessmentBlockDocumentRepository,
    QuestionDocumentRepository,
  ],
})
export class AssessmentModule { }
