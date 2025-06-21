import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { GradingService } from '../grading/grading.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthService } from '../auth/auth.service';
import { CryptoService } from 'src/providers/crypto.service';
import { SmsService } from 'src/providers/sms.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { Assessment, AssessmentSchema } from 'src/schemas/assessment.schema';
import { Organization, OrganizationSchema } from 'src/schemas/organization.schema';
import { AssessmentBlock, AssessmentBlockSchema } from 'src/schemas/assessment-block.schema';
import { CandidateResponse, CandidateResponseSchema } from 'src/schemas/candidate-response.schema';
import { CandidateAssessment, CandidateAssessmentSchema } from 'src/schemas/candidate-assessment.schema';
import { Question, QuestionSchema } from 'src/schemas/question.schema';
import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { CandidateAttemptLog, CandidateAttemptLogSchema } from 'src/schemas/candidate-attempt-log.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { CandidateAssessmentDocumentRepository } from './candidate-assessment.document.repository';
import { CandidateAttemptLogDocumentRepository } from './candidate-attempt-log.document.repository';
import { CandidateResponseDocumentRepository } from './candidate-response.document.repository';
import { CandidateDocumentRepository } from './candidate.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { AuthorizedTokenDocumentRepository } from '../auth/authorized.token.document.repository';
import { AuthorizedToken, AuthorizedTokenSchema } from 'src/schemas/authorized-token.schema';
import { UserDocumentRepository } from '../user/user.document.repository';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CandidateResponseScoreDocumentRepository } from '../grading/candidate-response-score.document.repository';
import { QuestionCommentDocumentRepository } from '../grading/question-comment.document.repository';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
import { CandidateResponseScoreSchema } from 'src/schemas/candidate-response-score.schema';
import { QuestionComment, QuestionCommentSchema } from 'src/schemas/question-comment.schema';


@Module({
  controllers: [CandidateController],
  imports: [
    JwtModule.registerAsync(jwtConfig),


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
    CandidateService,
    GradingService,
    AuthService,
    CryptoService,
    SmsService,
    DBConnectionService,
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
    AuthorizedTokenDocumentRepository,
  ],
  exports: [CandidateService],
})

export class CandidateModule { }
