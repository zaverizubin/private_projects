import { Module } from '@nestjs/common';

import { ReportOrganizationService } from './report.organization.service';
import { ReportOrganizationController } from './report.organization.controller';
import { ReportAssessmentService } from './report.assessment.service';
import { ReportAssessmentController } from './report.assessment.controller';

import { ReportCandidateService } from './report.candidate.service';
import { ReportCandidateController } from './report.candidate.controller';
import { EmailService } from 'src/providers/email.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { CandidateModule } from '../candidate/candidate.module';
import { FileService } from '../file/file.service';
import { CryptoService } from 'src/providers/crypto.service';

import { MongooseModule } from '@nestjs/mongoose';
import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { EmailLog, EmailLogSchema } from 'src/schemas/email-log.schema';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
import { Question } from 'src/entities/question.entity';
import { AssessmentBlockSchema } from 'src/schemas/assessment-block.schema';
import { AssessmentSchema } from 'src/schemas/assessment.schema';
import { AuthorizedToken, AuthorizedTokenSchema } from 'src/schemas/authorized-token.schema';
import { CandidateAssessment, CandidateAssessmentSchema } from 'src/schemas/candidate-assessment.schema';
import { CandidateAttemptLog, CandidateAttemptLogSchema } from 'src/schemas/candidate-attempt-log.schema';
import { CandidateResponseScoreSchema } from 'src/schemas/candidate-response-score.schema';
import { CandidateResponse, CandidateResponseSchema } from 'src/schemas/candidate-response.schema';
import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { Organization, OrganizationSchema } from 'src/schemas/organization.schema';
import { QuestionComment, QuestionCommentSchema } from 'src/schemas/question-comment.schema';
import { QuestionSchema } from 'src/schemas/question.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateAttemptLogDocumentRepository } from '../candidate/candidate-attempt-log.document.repository';
import { CandidateResponseDocumentRepository } from '../candidate/candidate-response.document.repository';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { CandidateResponseScoreDocumentRepository } from '../grading/candidate-response-score.document.repository';
import { QuestionCommentDocumentRepository } from '../grading/question-comment.document.repository';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { UserDocumentRepository } from '../user/user.document.repository';
import { ReportDocumentRepository } from './report.document.repository';

@Module({
  controllers: [
    ReportOrganizationController,
    ReportAssessmentController,
    ReportCandidateController,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: AssetFile.name, schema: AssetFileSchema },
      { name: EmailLog.name, schema: EmailLogSchema },
    ]),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentBlock.name, schema: AssessmentBlockSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: CandidateAssessment.name, schema: CandidateAssessmentSchema },
      { name: CandidateResponse.name, schema: CandidateResponseSchema },
      { name: CandidateAttemptLog.name, schema: CandidateAttemptLogSchema },
      { name: CandidateResponseScore.name, schema: CandidateResponseScoreSchema },
      { name: QuestionComment.name, schema: QuestionCommentSchema },
      { name: AssetFile.name, schema: AssetFileSchema },
      { name: AuthorizedToken.name, schema: AuthorizedTokenSchema }

    ]),

  ],
  providers: [
    ReportOrganizationService,
    EmailService,
    ReportAssessmentService,
    DBConnectionService,
    CandidateModule,
    ReportCandidateService,
    FileService,
    CryptoService,
    UserDocumentRepository,
    CandidateDocumentRepository,
    OrganizationDocumentRepository,
    AssessmentDocumentRepository,
    AssessmentBlockDocumentRepository,
    QuestionDocumentRepository,
    CandidateAssessmentDocumentRepository,
    CandidateResponseDocumentRepository,
    CandidateResponseScoreDocumentRepository,
    CandidateAttemptLogDocumentRepository,
    QuestionCommentDocumentRepository,
    AssetFileDocumentRepository,
    ReportDocumentRepository,
  ],
})
export class ReportModule { }
