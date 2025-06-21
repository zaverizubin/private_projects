import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/enums/role';
import { AuthorizationResponseCodes } from './authrorization.response.code';
import { QuestionDocumentRepository } from 'src/modules/question/question.document.repository';
import { AssessmentBlockDocumentRepository } from 'src/modules/assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from 'src/modules/assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from 'src/modules/candidate/candidate-assessment.document.repository';
import { CandidateDocumentRepository } from 'src/modules/candidate/candidate.document.repository';
import { UserDocumentRepository } from 'src/modules/user/user.document.repository';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  constructor(
    private questionDocumentRepository: QuestionDocumentRepository,
    private userDocumentRepository: UserDocumentRepository,
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
    private candidateDocumentRepository: CandidateDocumentRepository,
  ) {

  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const route = request.url;

    await this.authorizeUser(route, request);

    return next.handle();
  }

  private async authorizeUser(route: string, request: any) {
    const userObj = request.user;
    let userId: string;
    let role: string;
    if (userObj) {
      userId = userObj.sub;
      role = userObj.role;
    }

    //regex to match with url
    const assessmentRegex = /\/assessment\/([a-z0-9]{24})/i;
    const candidateAssessmentRegex = /\/candidate-assessment\/([a-z0-9]{24})/i;
    const assessmentBlockRegex = /\/assessment-block\/([a-z0-9]{24})/i;
    const candidateRegex = /\/candidate\/([a-z0-9]{24})/i;
    const questionRegex = /\/question\/([a-z0-9]{24})/i;
    const userRegex = /\/user\/([a-z0-9]{24})/i;
    const organizationRegex = /\/organization\/([a-z0-9]{24})/i;

    //todo

    if (role == Role.CANDIDATE) {
      const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(
        userId,
      );

      //check if url has candidate id if yes check candidate  exist of that id
      if (candidateRegex.test(route)) {
        const candidateId = String(candidateRegex.exec(route)[1]);

        if (candidateId != userId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      //check if url has candidate assessment id if yes check candidate assessment exist
      if (candidateAssessmentRegex.test(route)) {
        const candidateAssessmentId = String(
          candidateAssessmentRegex.exec(route)[1],
        );

        const candidateAssessmentDocument: CandidateAssessmentDocument =
          await this.candidateAssessmentDocumentRepository.findById(candidateAssessmentId);

        if (candidateAssessmentDocument && candidateAssessmentDocument.candidateDocument.toString() != userId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      //check if url has assessment id if yes check candidate assessment exist
      if (assessmentRegex.test(route)) {
        const assessmentId = String(assessmentRegex.exec(route)[1]);
        const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(
          assessmentId,
        );

        if (assessmentDocument) {
          const candidateAssessmentDocument: CandidateAssessmentDocument =
            await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
              candidateDocument,
              assessmentDocument,
            );
          if (!candidateAssessmentDocument) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }

      //check if url has assessment block id if yes get the assessment and check candidate assessment exist
      if (assessmentBlockRegex.test(route)) {
        const assessmentBlockId = String(assessmentBlockRegex.exec(route)[1]);

        const assessmentBlockDocument: AssessmentBlockDocument =
          await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);

        if (assessmentBlockDocument) {
          const assessmentId = assessmentBlockDocument.assessmentDocument.toString();

          const assessmentDocument: AssessmentDocument =
            await this.assessmentDocumentRepository.findById(assessmentId);

          if (assessmentDocument) {
            const candidateAssessmentDocument: CandidateAssessmentDocument =
              await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
                candidateDocument,
                assessmentDocument,
              );
            if (!candidateAssessmentDocument) {
              throw AuthorizationResponseCodes.ACCESS_DENIED;
            }
          }
        }
      }

      //check if url has question id if yes get the assessment that belongs to the question
      if (questionRegex.test(route)) {
        const questionId = String(questionRegex.exec(route)[1]);

        const questionDocument: QuestionDocument = await this.questionDocumentRepository.findById(questionId);
        const assessmentBlockDocument: AssessmentBlockDocument = await this.assessmentBlockDocumentRepository.findById(questionDocument.assessmentBlockDocument.toString());

        const assessmentDocument: AssessmentDocument =
          await this.assessmentDocumentRepository.findById(assessmentBlockDocument.assessmentDocument.toString());

        if (assessmentDocument) {
          const candidateAssessmentDocument: CandidateAssessmentDocument =
            await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
              candidateDocument,
              assessmentDocument,
            );
          if (!candidateAssessmentDocument) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }
    } else {
      //check if url has user id if yes check the user id against user id of jwt token
      if (userRegex.test(route) && userId) {
        const urlUserId = String(userRegex.exec(route)[1]);

        if (userId != urlUserId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      let userOrganizationId: string;
      const userDocument: UserDocument = await this.userDocumentRepository.findById(userId);
      if (userDocument && userDocument.organizationDocument) {
        userOrganizationId = userDocument.organizationDocument.toString();
      }

      let organizationId: string;

      //check if url has organization id
      if (organizationRegex.test(route)) {
        organizationId = String(organizationRegex.exec(route)[1]);

        if (userOrganizationId && userOrganizationId != organizationId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      //check if url has assessment id if yes get the organization id using assessment id
      if (assessmentRegex.test(route)) {
        const assessmentId = String(assessmentRegex.exec(route)[1]);
        const assessmentDocument: AssessmentDocument =
          await this.assessmentDocumentRepository.findById(assessmentId);

        if (assessmentDocument) {
          organizationId = assessmentDocument.organizationDocument.toString();

          if (userOrganizationId != organizationId) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }

      //check if url has assessment block id if yes get the organization id using the assessment block id
      if (assessmentBlockRegex.test(route)) {
        const assessmentBlockId = String(assessmentBlockRegex.exec(route)[1]);

        const assessmentBlockDocument: AssessmentBlockDocument =
          await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);

        if (assessmentBlockDocument) {
          const assessmentId = assessmentBlockDocument.assessmentDocument.toString();

          const assessmentDocument: AssessmentDocument =
            await this.assessmentDocumentRepository.findById(assessmentId);

          if (assessmentDocument) {
            organizationId = assessmentDocument.organizationDocument.toString();

            if (userOrganizationId != organizationId) {
              throw AuthorizationResponseCodes.ACCESS_DENIED;
            }
          }
        }
      }

      //check if url has question id if yes get the organization id using the question id
      if (questionRegex.test(route)) {
        const questionId = String(questionRegex.exec(route)[1]);

        const questionDocument: QuestionDocument =
          await this.questionDocumentRepository.findById(questionId);
        if (questionDocument) {
          const assessmentBlockId = questionDocument.assessmentBlockDocument.toString();

          const assessmentBlockDocument: AssessmentBlockDocument =
            await this.assessmentBlockDocumentRepository.findById(
              assessmentBlockId,
            );

          if (assessmentBlockDocument) {
            const assessmentId = assessmentBlockDocument.assessmentDocument.toString();

            const assessmentDocument: AssessmentDocument =
              await this.assessmentDocumentRepository.findById(assessmentId);

            if (assessmentDocument) {
              organizationId = assessmentDocument.organizationDocument.toString();

              if (userOrganizationId != organizationId) {
                throw AuthorizationResponseCodes.ACCESS_DENIED;
              }
            }
          }
        }
      }
    }
  }
}
