import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { QuestionCommentReqDto } from './dto/request/question-comment.req.dto';
import { QuestionScoreReqDto } from './dto/request/question-score.req.dto';
import { AssessmentQuestionScoreRespDto } from './dto/response/assessment-question-score.resp.dto';
import { QuestionCommentRespDto } from './dto/response/question-comment.resp.dto';
import { GradingResponseCodes } from './grading.response.codes';
import { GradingService } from './grading.service';

@Controller('grading')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @ApiOperation({ summary: 'Get candidate question scores for assessment' })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId/score')
  async getScoresForAssessment(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    return await this.gradingService.getCandidateScoresByAssessment(
      candidateId,
      assessmentId,
    );
  }

  @ApiOperation({
    summary: 'Get candidate question scores for assessment block',
  })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment-block/:assessmentBlockId/score')
  async getScoresForAssessmentBlock(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentBlockId', ParseIntPipe) assessmentBlockId: number,
  ): Promise<AssessmentQuestionScoreRespDto[]> {
    return await this.gradingService.getCandidateScoresByAssessmentBlock(
      candidateId,
      assessmentBlockId,
    );
  }

  @ApiOperation({
    summary: 'Get candidate unscored questions for assesment',
  })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId/question/unscored')
  async getUnScoredQuestionsForAssessment(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ): Promise<number[]> {
    return await this.gradingService.getCandidateUnScoredQuestionsForAssessment(
      candidateId,
      assessmentId,
    );
  }

  @ApiOperation({
    summary: 'Get candidate question comments',
  })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_QUESTION_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/question/:questionId/comment')
  async getAllQuestionComments(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<QuestionCommentRespDto[]> {
    return await this.gradingService.getCandidateQuestionComments(
      candidateId,
      questionId,
    );
  }

  @ApiOperation({ summary: 'Submit candidate question comments' })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_QUESTION_ID)
  @HttpCode(200)
  @Put('candidate/:candidateId/question/:questionId/comment')
  async setQuestionComment(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body()
    questionCommentReqDto: QuestionCommentReqDto,
  ) {
    return await this.gradingService.saveCandidateQuestionComment(
      candidateId,
      questionId,
      questionCommentReqDto,
    );
  }

  @ApiOperation({ summary: 'Submit candidate question score' })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(GradingResponseCodes.INVALID_QUESTION_ID)
  @HttpCode(200)
  @Put('candidate/:candidateId/score')
  async saveCandidateResponseScore(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body()
    questionScoreReqDto: QuestionScoreReqDto,
  ) {
    return await this.gradingService.saveCandidateResponseScore(
      candidateId,
      questionScoreReqDto,
    );
  }

  @ApiOperation({
    summary: 'Get candidate assessment decision',
  })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId/decision')
  async getAssessmentDecision(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ): Promise<AssessmentDecision> {
    return await this.gradingService.getCandidateAssessmentDecision(
      candidateId,
      assessmentId,
    );
  }

  @ApiOperation({ summary: 'Mark assessment grading complete' })
  @ApiResponse(GradingResponseCodes.SUCCESS)
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Patch('candidate/:candidateId/assessment/:assessmentId/grading/complete')
  async markAssessmentGradingComplete(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ) {
    return await this.gradingService.markCandidateAssessmentGradingComplete(
      candidateId,
      assessmentId,
    );
  }

  @ApiOperation({ summary: 'Set candidate assessment decision' })
  @ApiResponse({
    ...GradingResponseCodes.SUCCESS,
    type: [],
  })
  @ApiResponse(GradingResponseCodes.BAD_REQUEST)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_DECISION)
  @ApiResponse(GradingResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(GradingResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Put('candidate/:candidateId/assessment/:assessmentId/decision/:decision')
  async setAssessmentDecision(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
    @Param('decision') decision: string,
  ) {
    return await this.gradingService.setCandidateAssessmentDecision(
      candidateId,
      assessmentId,
      decision,
    );
  }
}
