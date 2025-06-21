import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentRepository } from './assessment.repository';
import { FileRepository } from '../file/file.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { CryptoService } from 'src/providers/crypto.service';
import { QuestionRepository } from '../question/question.repository';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentRepository,
      QuestionRepository,
      FileRepository,
      OrganizationRepository,
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, FileService, CryptoService],
})
export class AssessmentModule {}
