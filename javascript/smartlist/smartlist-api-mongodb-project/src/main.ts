import { AppModule } from './app.module';
import { SwaggerBuilder } from './providers/swagger.builder';
import { AllExceptionsFilter } from './filters/all.exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggerService } from './providers/logger.service';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { rootDir } from 'root';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import * as hbs from 'hbs';
import { AssessmentBlockDocumentRepository } from './modules/assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from './modules/assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from './modules/candidate/candidate-assessment.document.repository';
import { CandidateDocumentRepository } from './modules/candidate/candidate.document.repository';
import { QuestionDocumentRepository } from './modules/question/question.document.repository';
import { UserDocumentRepository } from './modules/user/user.document.repository';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const loggerService = app.get(LoggerService);
  const configService = app.get(ConfigService);
  const questionDocumentRepository = app.get(QuestionDocumentRepository);
  const userDocumentRepository = app.get(UserDocumentRepository);
  const assessmentDocumentRepository = app.get(AssessmentDocumentRepository);
  const assessmentBlockDocumentRepository = app.get(AssessmentBlockDocumentRepository);
  const candidateAssessmentDocumentRepository = app.get(CandidateAssessmentDocumentRepository);
  const candidateDocumentRepository = app.get(CandidateDocumentRepository);


  //Swagger api documentation
  SwaggerBuilder.build(app);

  app.useStaticAssets(join(rootDir(), '..', 'uploads'));
  app.useGlobalFilters(new AllExceptionsFilter(loggerService));
  app.useGlobalInterceptors(
    new AuthorizationInterceptor(questionDocumentRepository, userDocumentRepository,
      assessmentDocumentRepository, assessmentBlockDocumentRepository,
      candidateAssessmentDocumentRepository, candidateDocumentRepository),
    new LoggingInterceptor(loggerService, configService),
  );

  //this required before view engine setup
  hbs.registerPartials(__dirname + '/assets/partials');

  // view engine setup
  app.set('views', __dirname + '/assets/report_templates');
  app.set('view engine', 'hbs');

  //Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(process.env.APP_PORT);
}
bootstrap();
