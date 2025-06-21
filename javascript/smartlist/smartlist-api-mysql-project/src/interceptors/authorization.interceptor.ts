import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Question } from 'src/entities/question.entity';
import { QuestionRepository } from 'src/modules/question/question.repository';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from 'src/modules/user/user.repository';
import { User } from 'src/entities/user.entity';
import { AssessmentRepository } from 'src/modules/assessment/assessment.repository';
import { Assessment } from 'src/entities/assessment.entity';
import { AssessmentBlockRepository } from 'src/modules/assessment-block/assessment-block.repository';
import { Role } from 'src/enums/role';
import { CandidateAssessmentRepository } from 'src/modules/candidate/candidate.assessment.repository';
import { CandidateRepository } from 'src/modules/candidate/candidate.repository';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { AuthorizationResponseCodes } from './authrorization.response.code';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  private questionRepository: QuestionRepository;
  private userRepository: UserRepository;
  private assessmentRepository: AssessmentRepository;
  private assessmentBlockRepository: AssessmentBlockRepository;
  private candidateAssessmentRepository: CandidateAssessmentRepository;
  private candidateRepository: CandidateRepository;

  constructor() {
    this.questionRepository = getCustomRepository(QuestionRepository);
    this.userRepository = getCustomRepository(UserRepository);
    this.assessmentRepository = getCustomRepository(AssessmentRepository);
    this.assessmentBlockRepository = getCustomRepository(
      AssessmentBlockRepository,
    );
    this.candidateAssessmentRepository = getCustomRepository(
      CandidateAssessmentRepository,
    );
    this.candidateRepository = getCustomRepository(CandidateRepository);
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
    let userId: number;
    let role: string;
    if (userObj) {
      userId = userObj.sub;
      role = userObj.role;
    }

    //regex to match with url
    const assessmentRegex = /\/assessment\/([0-9]+)/;
    const candidateAssessmentRegex = /\/candidate-assessment\/([0-9]+)/;
    const assessmentBlockRegex = /\/assessment-block\/([0-9]+)/;
    const candidateRegex = /\/candidate\/([0-9]+)/;
    const questionRegex = /\/question\/([0-9]+)/;
    const userRegex = /\/user\/([0-9]+)/;
    const organizationRegex = /\/organization\/([0-9]+)/;

    if (role == Role.CANDIDATE) {
      const candidate: Candidate = await this.candidateRepository.findById(
        userId,
      );

      //check if url has candidate id if yes check candidate  exist of that id
      if (candidateRegex.test(route)) {
        const candidateId = Number(candidateRegex.exec(route)[1]);

        if (candidateId != userId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      //check if url has candidate assessment id if yes check candidate assessment exist
      if (candidateAssessmentRegex.test(route)) {
        const candidateAssessmentId = Number(
          candidateAssessmentRegex.exec(route)[1],
        );

        const candidateAssessment: CandidateAssessment =
          await this.candidateAssessmentRepository.findByIdWithCandidate(
            candidateAssessmentId,
          );

        if (candidateAssessment && candidateAssessment.candidate) {
          if (candidateAssessment.candidate.id != userId) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }

      //check if url has assessment id if yes check candidate assessment exist
      if (assessmentRegex.test(route)) {
        const assessmentId = Number(assessmentRegex.exec(route)[1]);
        const assessment: Assessment = await this.assessmentRepository.findById(
          assessmentId,
        );

        if (assessment) {
          const candidateAssessment: CandidateAssessment =
            await this.candidateAssessmentRepository.getForCandidateAndAssessment(
              candidate,
              assessment,
            );
          if (!candidateAssessment) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }

      //check if url has assessment block id if yes get the assessment and check candidate assessment exist
      if (assessmentBlockRegex.test(route)) {
        const assessmentBlockId = Number(assessmentBlockRegex.exec(route)[1]);

        const assessmentBlock: AssessmentBlock =
          await this.assessmentBlockRepository.findByIdWithAssessment(
            assessmentBlockId,
          );

        if (assessmentBlock) {
          const assessmentId = assessmentBlock.assessment.id;

          const assessment: Assessment =
            await this.assessmentRepository.findById(assessmentId);

          if (assessment) {
            const candidateAssessment: CandidateAssessment =
              await this.candidateAssessmentRepository.getForCandidateAndAssessment(
                candidate,
                assessment,
              );
            if (!candidateAssessment) {
              throw AuthorizationResponseCodes.ACCESS_DENIED;
            }
          }
        }
      }

      //check if url has question id if yes get the assessment that belongs to the question
      if (questionRegex.test(route)) {
        const questionId = Number(questionRegex.exec(route)[1]);

        const assessment: Assessment =
          await this.assessmentRepository.findByIdWithQuestionsRelations(
            questionId,
          );

        if (assessment) {
          const candidateAssessment: CandidateAssessment =
            await this.candidateAssessmentRepository.getForCandidateAndAssessment(
              candidate,
              assessment,
            );
          if (!candidateAssessment) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }
    } else {
      //check if url has user id if yes check the user id against user id of jwt token
      if (userRegex.test(route) && userId) {
        const urlUserId = Number(userRegex.exec(route)[1]);

        if (userId != urlUserId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      let userOrganizatinId: number;
      const user: User = await this.userRepository.findById(userId);
      if (user && user.organization) {
        userOrganizatinId = user.organization.id;
      }

      let organizationId: number;

      //check if url has organization id
      if (organizationRegex.test(route)) {
        organizationId = Number(organizationRegex.exec(route)[1]);

        if (userOrganizatinId && userOrganizatinId != organizationId) {
          throw AuthorizationResponseCodes.ACCESS_DENIED;
        }
      }

      //check if url has assessment id if yes get the organization id using assessment id
      if (assessmentRegex.test(route)) {
        const assessmentId = Number(assessmentRegex.exec(route)[1]);
        const assessment: Assessment =
          await this.assessmentRepository.findByIdWithRelations(assessmentId);

        if (assessment) {
          organizationId = assessment.organization.id;

          if (userOrganizatinId != organizationId) {
            throw AuthorizationResponseCodes.ACCESS_DENIED;
          }
        }
      }

      //check if url has assessment block id if yes get the organization id using the assessment block id
      if (assessmentBlockRegex.test(route)) {
        const assessmentBlockId = Number(assessmentBlockRegex.exec(route)[1]);

        const assessmentBlock: AssessmentBlock =
          await this.assessmentBlockRepository.findByIdWithAssessment(
            assessmentBlockId,
          );

        if (assessmentBlock) {
          const assessmentId = assessmentBlock.assessment.id;

          const assessment: Assessment =
            await this.assessmentRepository.findByIdWithRelations(assessmentId);

          if (assessment) {
            organizationId = assessment.organization.id;

            if (userOrganizatinId != organizationId) {
              throw AuthorizationResponseCodes.ACCESS_DENIED;
            }
          }
        }
      }

      //check if url has question id if yes get the organization id using the question id
      if (questionRegex.test(route)) {
        const questionid = Number(questionRegex.exec(route)[1]);

        const question: Question =
          await this.questionRepository.findByIdWithAssessmentBlock(questionid);
        if (question) {
          const assessmentBlockId = question.assessmentBlock.id;

          const assessmentBlock: AssessmentBlock =
            await this.assessmentBlockRepository.findByIdWithAssessment(
              assessmentBlockId,
            );

          if (assessmentBlock) {
            const assessmentId = assessmentBlock.assessment.id;

            const assessment: Assessment =
              await this.assessmentRepository.findByIdWithRelations(
                assessmentId,
              );

            if (assessment) {
              organizationId = assessment.organization.id;

              if (userOrganizatinId != organizationId) {
                throw AuthorizationResponseCodes.ACCESS_DENIED;
              }
            }
          }
        }
      }
    }
  }
}
