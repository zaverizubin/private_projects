import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportOrganizationService } from './report.organization.service';
import { ReportOrganizationController } from './report.organization.controller';
import { ReportAssessmentService } from './report.assessment.service';
import { ReportAssessmentController } from './report.assessment.controller';

import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { GradingRepository } from '../grading/grading.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { ReportCandidateService } from './report.candidate.service';
import { ReportCandidateController } from './report.candidate.controller';
import { CandidateRepository } from '../candidate/candidate.repository';
import { EmailService } from 'src/providers/email.service';
import DBConnectionService from 'src/providers/db.connection.service';
import { CandidateModule } from '../candidate/candidate.module';
import { GradingModule } from '../grading/grading.module';
import { GradingService } from '../grading/grading.service';
import { QuestionRepository } from '../question/question.repository';
import { QuestionCommentRepository } from '../grading/question-comment.repository';
import { FileService } from '../file/file.service';
import { FileRepository } from '../file/file.repository';
import { CryptoService } from 'src/providers/crypto.service';
import { CandidateResponseRepository } from '../candidate/candidate.response.repository';

@Module({
  controllers: [
    ReportOrganizationController,
    ReportAssessmentController,
    ReportCandidateController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      OrganizationRepository,
      AssessmentRepository,
      AssessmentBlockRepository,
      CandidateAssessmentRepository,
      GradingRepository,
      CandidateRepository,
      QuestionRepository,
      QuestionCommentRepository,
      FileRepository,
      CandidateResponseRepository,
    ]),
    CandidateModule,
    GradingModule,
  ],
  providers: [
    ReportOrganizationService,
    EmailService,
    ReportAssessmentService,
    DBConnectionService,
    CandidateModule,
    ReportCandidateService,
    GradingModule,
    GradingService,
    FileService,
    CryptoService,
  ],
})
export class ReportModule {}
