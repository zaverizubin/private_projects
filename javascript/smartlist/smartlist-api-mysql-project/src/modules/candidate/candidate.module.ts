import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateRepository } from './candidate.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { CandidateAssessmentRepository } from './candidate.assessment.repository';
import { FileRepository } from '../file/file.repository';
import { AnswerOptionRepository } from '../question/answer-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { CandidateResponseRepository } from './candidate.response.repository';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { GradingService } from '../grading/grading.service';
import { GradingRepository } from '../grading/grading.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { CandidateAttemptLogRepository } from './candidate.attempt.log.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from '../auth/auth.repository';
import { UserRepository } from '../user/user.repository';
import { CryptoService } from 'src/providers/crypto.service';
import { QuestionCommentRepository } from '../grading/question-comment.repository';
import { SmsService } from 'src/providers/sms.service';
import { CandidateSmsLogRepository } from './candidate.sms.repository';
import DBConnectionService from 'src/providers/db.connection.service';

@Module({
  controllers: [CandidateController],
  imports: [
    JwtModule.registerAsync(jwtConfig),

    TypeOrmModule.forFeature([
      CandidateRepository,
      OrganizationRepository,
      AssessmentRepository,
      AssessmentBlockRepository,
      CandidateAssessmentRepository,
      CandidateResponseRepository,
      FileRepository,
      QuestionRepository,
      AnswerOptionRepository,
      CandidateAttemptLogRepository,
      GradingRepository,
      UserRepository,
      AuthRepository,
      QuestionCommentRepository,
      CandidateSmsLogRepository,
    ]),
  ],
  providers: [
    CandidateService,
    GradingService,
    AuthService,
    CryptoService,
    SmsService,
    DBConnectionService,
  ],
  exports: [CandidateService],
})
export class CandidateModule {}
