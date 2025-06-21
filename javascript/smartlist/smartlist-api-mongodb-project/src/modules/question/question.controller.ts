import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { QuestionReqDto } from './dto/request/question.req.dto';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { QuestionRespDto } from './dto/response/question.resp.dto';
import { QuestionResponseCodes } from './question.response.codes';

import { QuestionService } from './question.service';

@Controller('')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class QuestionController {
  static rootRoute = 'question/';

  constructor(private readonly questionService: QuestionService) { }

  @ApiOperation({ summary: 'Get assessment block questions' })
  @ApiResponse({
    ...QuestionResponseCodes.SUCCESS,
    type: QuestionRespDto,
  })
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get('assessment-block/:id/' + QuestionController.rootRoute)
  async getAll(@Param('id') id: string): Promise<QuestionRespDto[]> {
    return await this.questionService.getAllByAssessmentBlockId(
      id,
      false,
      null,
    );
  }

  @ApiOperation({ summary: 'Get all attempted questions for assessment block and candidate' })
  @ApiResponse({
    ...QuestionResponseCodes.SUCCESS,
    type: QuestionRespDto,
  })
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(
    'assessment-block/:id/' +
    QuestionController.rootRoute +
    'candidate/:candidateId',
  )
  async getAllCandidateQuestion(
    @Param('id') id: string,
    @Param('candidateId') candidateId: string,
  ): Promise<QuestionRespDto[]> {
    return await this.questionService.getAllByAssessmentBlockId(
      id,
      false,
      candidateId,
    );
  }

  @ApiOperation({
    summary:
      'Get all questions for assessment block(for assessment delivery)',
  })
  @ApiResponse({
    ...QuestionResponseCodes.SUCCESS,
    type: QuestionRespDto,
  })
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(
    'assessment-block/:id/' + QuestionController.rootRoute + 'for-assessment',
  )
  async getAllForAssessment(
    @Param('id') id: string,
  ): Promise<QuestionRespDto[]> {
    return await this.questionService.getAllByAssessmentBlockId(id, true, null);
  }

  @ApiOperation({ summary: 'Get question' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_ID)
  @HttpCode(200)
  @Get(QuestionController.rootRoute + ':id')
  async get(@Param('id') id: string) {
    return await this.questionService.getQuestionById(id, false);
  }

  @ApiOperation({ summary: 'Get question without correct option field value' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_ID)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(QuestionController.rootRoute + ':id/for-assessment')
  async getForAssessment(@Param('id') id: string) {
    return await this.questionService.getQuestionById(id, true);
  }

  @ApiOperation({ summary: 'Create question' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_OPTION)
  @HttpCode(201)
  @Post('assessment-block/:id/' + QuestionController.rootRoute)
  create(
    @Param('id') id: string,
    @Body() questionReqDto: QuestionReqDto,
  ): Promise<string> {
    return this.questionService.createQuestion(id, questionReqDto);
  }

  @ApiOperation({ summary: 'Update question' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_ID)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_OPTION)
  @HttpCode(200)
  @Put(QuestionController.rootRoute + ':id')
  async update(
    @Param('id') id: string,
    @Body() questionReqDto: QuestionReqDto,
  ) {
    return await this.questionService.updateQuestion(id, questionReqDto);
  }

  @ApiOperation({ summary: 'Reorder questions' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_ID)
  @ApiResponse(QuestionResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @ApiResponse(QuestionResponseCodes.ASSESSMENT_ACTION_DENIED)
  @HttpCode(200)
  @Patch('assessment-block/:id/' + QuestionController.rootRoute + 'reorder')
  async reorder(@Param('id') id: string, @Body() reorderReqDto: ReorderReqDto) {
    return await this.questionService.reorderQuestions(id, reorderReqDto);
  }
  @ApiOperation({ summary: 'Delete question' })
  @ApiResponse(QuestionResponseCodes.SUCCESS)
  @ApiResponse(QuestionResponseCodes.BAD_REQUEST)
  @ApiResponse(QuestionResponseCodes.INVALID_QUESTION_ID)
  @ApiResponse(QuestionResponseCodes.ASSESSMENT_ACTION_DENIED)
  @HttpCode(200)
  @Delete(QuestionController.rootRoute + ':id')
  delete(@Param('id') id: string) {
    return this.questionService.deleteQuestion(id);
  }
}
