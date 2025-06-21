import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { emailConfig } from './config/email.config';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/file/file.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { LoggerService } from './providers/logger.service';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { AssessmentBlockModule } from './modules/assessment-block/assessment-block.module';
import { UserModule } from './modules/user/user.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { QuestionModule } from './modules/question/question.module';
import { GradingModule } from './modules/grading/grading.module';
import { ReportModule } from './modules/report/report.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './guards/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseAsyncConfig } from './config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FilesModule,
    MongooseModule.forRootAsync(mongooseAsyncConfig),
    MailerModule.forRootAsync(emailConfig),
    UserModule,
    OrganizationModule,
    AssessmentModule,
    AssessmentBlockModule,
    CandidateModule,
    QuestionModule,
    GradingModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
