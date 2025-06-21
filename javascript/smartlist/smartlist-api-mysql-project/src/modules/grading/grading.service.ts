import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import { CandidateResponseScore } from 'src/entities/candidate-response-score.entity';
import { Candidate } from 'src/entities/candidate.entity';
import { QuestionComment } from 'src/entities/question-comment.entity';
import { Question } from 'src/entities/question.entity';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { QuestionType } from 'src/enums/question.type';

import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { CandidateRepository } from '../candidate/candidate.repository';
import { CandidateResponseRepository } from '../candidate/candidate.response.repository';
import { IQuestionStrategy } from '../candidate/interfaces/interface-question-strategy';
import { QuestionRepository } from '../question/question.repository';
import { QuestionCommentReqDto } from './dto/request/question-comment.req.dto';
import { QuestionScoreReqDto } from './dto/request/question-score.req.dto';
import { AssessmentQuestionScoreRespDto } from './dto/response/assessment-question-score.resp.dto';
import { QuestionCommentRespDto } from './dto/response/question-comment.resp.dto';
import { GradingRepository } from './grading.repository';
import { GradingResponseCodes } from './grading.response.codes';
import { QuestionCommentRepository } from './question-comment.repository';

@Injectable()
export class GradingService {
  constructor(
    @InjectRepository(GradingRepository)
    private gradingRepository: GradingRepository,
    @InjectRepository(CandidateRepository)
    private candidateRepository: CandidateRepository,
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
    @InjectRepository(AssessmentBlockRepository)
    private assessmentBlockRepository: AssessmentBlockRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @InjectRepository(CandidateAssessmentRepository)
    private candidateAssessmentRepository: CandidateAssessmentRepository,
    @InjectRepository(QuestionCommentRepository)
    private questionCommentRepository: QuestionCommentRepository,
    @InjectRepository(CandidateResponseRepository)
    private candidateResponseRepository: CandidateResponseRepository,
  ) {}

  async getCandidateScoresByAssessment(
    candidateId: number,
    assessmentId: number,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const candidateResponseScores: CandidateResponseScore[] =
      await this.gradingRepository.getForCandidateByAssessment(
        candidate,
        assessment,
      );
    const assessmentQuestionScoreRespDtos: AssessmentQuestionScoreRespDto[] =
      [];

    candidateResponseScores.forEach((candidateResponseScore) => {
      assessmentQuestionScoreRespDtos.push(
        new AssessmentQuestionScoreRespDto(candidateResponseScore),
      );
    });
    return assessmentQuestionScoreRespDtos;
  }

  async getCandidateScoresByAssessmentBlock(
    candidateId: number,
    assessmentBlockId: number,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessmentBlock: AssessmentBlock =
      await this.getAssessmentBlockByIdOrThrow(assessmentBlockId);

    const candidateResponseScores: CandidateResponseScore[] =
      await this.gradingRepository.getForCandidateByAssessmentBlock(
        candidate,
        assessmentBlock,
      );
    const assessmentQuestionScoreRespDtos: AssessmentQuestionScoreRespDto[] =
      [];

    candidateResponseScores.forEach((candidateResponseScore) => {
      assessmentQuestionScoreRespDtos.push(
        new AssessmentQuestionScoreRespDto(candidateResponseScore),
      );
    });
    return assessmentQuestionScoreRespDtos;
  }

  async getCandidateUnScoredQuestionsForAssessment(
    candidateId: number,
    assessmentId: number,
  ): Promise<number[]> {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const questions: Question[] =
      await this.questionRepository.findAllByAssessment(assessment);

    const candidateResponseScores: CandidateResponseScore[] =
      await this.gradingRepository.getForCandidateByAssessment(
        candidate,
        assessment,
      );

    const unscoredQuestionIds: number[] = [];
    for (let i = 0; i < questions.length; i++) {
      if (
        questions[i].type != QuestionType.TEXT_RESPONSE &&
        questions[i].type != QuestionType.VIDEO_RESPONSE &&
        questions[i].type != QuestionType.FILE_RESPONSE
      ) {
        continue;
      }
      const candidateResponseScore: CandidateResponseScore =
        candidateResponseScores.find(
          (crs) => crs.question.id == questions[i].id,
        );
      if (candidateResponseScore == null) {
        unscoredQuestionIds.push(questions[i].id);
      }
    }
    return unscoredQuestionIds;
  }

  async getCandidateQuestionComments(
    candidateId: number,
    questionId: number,
  ): Promise<QuestionCommentRespDto[]> {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const question: Question = await this.getQuestionByIdOrThrow(questionId);

    const questionComments: QuestionComment[] =
      await this.questionCommentRepository.findAllForCandidateQuestion(
        candidate,
        question,
      );

    const questionCommentRespDtos: QuestionCommentRespDto[] = [];
    questionComments.forEach((questionComment) => {
      questionCommentRespDtos.push(new QuestionCommentRespDto(questionComment));
    });

    return questionCommentRespDtos;
  }

  async saveCandidateQuestionComment(
    candidateId: number,
    questionId: number,
    questionCommentReqDto: QuestionCommentReqDto,
  ) {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const question: Question = await this.getQuestionByIdOrThrow(questionId);

    let questionComment: QuestionComment =
      await this.questionCommentRepository.getForCandidateQuestionAndUsername(
        candidate,
        question,
        questionCommentReqDto.username,
      );
    if (questionComment != null) {
      questionComment.comment = questionCommentReqDto.comment;
    } else {
      questionComment = new QuestionComment();
      questionComment.candidate = candidate;
      questionComment.question = question;
      questionComment.username = questionCommentReqDto.username;
      questionComment.comment = questionCommentReqDto.comment;
    }

    this.questionCommentRepository.save(questionComment);
  }

  async saveCandidateResponseScore(
    candidateId: number,
    questionScoreReqDto: QuestionScoreReqDto,
  ) {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      questionScoreReqDto.assessment_id,
    );

    if (assessment.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const question: Question =
      await this.questionRepository.findByIdWithRelations(
        questionScoreReqDto.question_id,
      );
    if (question == null) {
      throw GradingResponseCodes.INVALID_QUESTION_ID;
    }

    if (question.assessmentBlock.assessment.id != assessment.id) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_ID;
    }

    const candidateResponseScore: CandidateResponseScore =
      new CandidateResponseScore();
    candidateResponseScore.candidate = candidate;
    candidateResponseScore.question = question;
    candidateResponseScore.assessmentBlock = question.assessmentBlock;
    candidateResponseScore.assessment = question.assessmentBlock.assessment;
    candidateResponseScore.score = questionScoreReqDto.score;

    await this.gradingRepository.delete({
      candidate: candidate,
      question: question,
    });
    await this.gradingRepository.save(candidateResponseScore);
  }

  async autoScoreAndSaveCandidateResponseScore(
    candidate: Candidate,
    question: Question,
    questionStrategy: IQuestionStrategy,
  ) {
    const candidateResponseScore: CandidateResponseScore =
      new CandidateResponseScore();
    candidateResponseScore.candidate = candidate;
    candidateResponseScore.question = question;
    candidateResponseScore.assessmentBlock = question.assessmentBlock;
    candidateResponseScore.assessment = question.assessmentBlock.assessment;
    candidateResponseScore.score = questionStrategy.score();

    await this.gradingRepository.delete({
      candidate: candidate,
      question: question,
    });

    await this.gradingRepository.save(candidateResponseScore);
  }

  async markCandidateAssessmentGradingComplete(
    candidateId: number,
    assessmentId: number,
  ) {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    if (assessment.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.getForCandidateAndAssessment(
        candidate,
        assessment,
      );

    if (!candidateAssessment) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    if (
      candidateAssessment.status != CandidateAssessmentStatus.GRADING_PENDING
    ) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    const countOfScoredResponses: number =
      await this.gradingRepository.getCountForCandidateByAssessment(
        candidate,
        assessment,
      );

    const countOfResponses: number =
      await this.candidateResponseRepository.findCountByCandidateAssessment(
        candidateAssessment,
      );

    if (countOfScoredResponses != countOfResponses) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_SCORING_PENDING;
    }

    candidateAssessment.status = CandidateAssessmentStatus.GRADING_COMPLETED;
    candidateAssessment.endDate = new Date();
    await this.candidateAssessmentRepository.save(candidateAssessment);
  }

  async getCandidateAssessmentDecision(
    candidateId: number,
    assessmentId: number,
  ): Promise<AssessmentDecision> {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.getForCandidateAndAssessment(
        candidate,
        assessment,
      );

    if (!candidateAssessment) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    return candidateAssessment.assessmentDecision;
  }

  async setCandidateAssessmentDecision(
    candidateId: number,
    assessmentId: number,
    decision: string,
  ) {
    const candidate: Candidate = await this.getCandidateByIdOrThrow(
      candidateId,
    );

    const assessment: Assessment = await this.getAssessmentByIdOrThrow(
      assessmentId,
    );

    if (assessment.status != AssessmentStatus.ACTIVE) {
      throw GradingResponseCodes.ASSESSMENT_ACTION_DENIED;
    }

    const assessmentDecision: AssessmentDecision =
      AssessmentDecision[decision as keyof typeof AssessmentDecision];

    if (assessmentDecision == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_DECISION;
    }

    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.getForCandidateAndAssessment(
        candidate,
        assessment,
      );

    if (candidateAssessment == null) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }

    if (
      candidateAssessment.status != CandidateAssessmentStatus.GRADING_COMPLETED
    ) {
      throw GradingResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED;
    }

    candidateAssessment.assessmentDecision = assessmentDecision;

    await this.candidateAssessmentRepository.save(candidateAssessment);
  }

  private async getCandidateByIdOrThrow(id: number): Promise<Candidate> {
    const candidate: Candidate = await this.candidateRepository.findById(id);

    if (candidate == null) {
      throw GradingResponseCodes.INVALID_CANDIDATE_ID;
    }
    return candidate;
  }

  private async getAssessmentByIdOrThrow(id: number): Promise<Assessment> {
    const assessment: Assessment = await this.assessmentRepository.findById(id);
    if (assessment == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_ID;
    }
    return assessment;
  }

  private async getAssessmentBlockByIdOrThrow(
    id: number,
  ): Promise<AssessmentBlock> {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findById(id);
    if (assessmentBlock == null) {
      throw GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
    return assessmentBlock;
  }

  private async getQuestionByIdOrThrow(id: number): Promise<Question> {
    const question: Question = await this.questionRepository.findById(id);
    if (question == null) {
      throw GradingResponseCodes.INVALID_QUESTION_ID;
    }
    return question;
  }
}
