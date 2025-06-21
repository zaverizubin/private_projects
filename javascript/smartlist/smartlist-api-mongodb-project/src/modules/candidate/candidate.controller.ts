import { ParseIntPipe, Patch, Put, Query } from '@nestjs/common';
import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { AuthRespDto } from '../auth/dto/response/auth.resp.dto';
import { Public } from '../auth/jwt-auth.guard';
import { CandidateResponseCodes } from './candidate.response.codes';
import { CandidateService } from './candidate.service';
import { CreateCandidateReqDto } from './dto/request/create-candidate.req.dto';
import { SubmitAnswerReqDto } from './dto/request/submit-answer.req.dto';
import { UpdateCandidateProfileReqDto } from './dto/request/update-candidate.req.dto';
import { CandidateAssessmentRespDto } from './dto/response/candidate-assessment.resp.dto';
import { CandidateResponseRespDto } from './dto/response/candidate-response.resp.dto';
import { CandidateRespDto } from './dto/response/candidate.resp.dto';
import { AuthService } from '../auth/auth.service';
import { Candidate } from 'src/entities/candidate.entity';
import { CandidateAssessmentIntroRespDto } from './dto/response/candidate-assessment-intro.resp.dto';
import { CandidateDocument } from 'src/schemas/candidate.schema';

@ApiTags('Candidate')
@Controller('')
@Roles(Role.CANDIDATE)
export class CandidateController {
  static rootRoute = 'candidate/';

  constructor(
    private readonly candidateService: CandidateService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: 'Get assessment introduction by assessment token' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateAssessmentIntroRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN)
  @Public()
  @HttpCode(200)
  @Get(CandidateController.rootRoute + 'assessment/token/:token/intro')
  async getCandidateAssessmentIntro(
    @Param('token') token: string,
  ): Promise<CandidateAssessmentIntroRespDto> {
    return await this.candidateService.getCandidateAssessmentIntro(token);
  }

  @ApiOperation({ summary: 'Create candidate' })
  @ApiResponse({ ...CandidateResponseCodes.CREATED, type: String })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_EXISTS)
  @ApiProduces('application/text')
  @Public()
  @HttpCode(201)
  @Post(CandidateController.rootRoute)
  async create(
    @Body() createCandidateReqDto: CreateCandidateReqDto,
  ): Promise<string> {
    return await this.candidateService.createCandidate(createCandidateReqDto);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: AuthRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_VERIFICATION_CODE)
  @Public()
  @HttpCode(200)
  @Patch(CandidateController.rootRoute + ':id/verify/:otp')
  async verifyOTP(
    @Param('id') id: string,
    @Param('otp', ParseIntPipe) otp: number,
  ): Promise<AuthRespDto> {
    const candidateDocument: CandidateDocument = await this.candidateService.verifyCandidateOTP(
      id,
      otp,
    );
    return await this.authService.loginCandidate(candidateDocument);
  }

  @ApiOperation({ summary: 'Send OTP' })
  @ApiResponse({ ...CandidateResponseCodes.SUCCESS })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ALREADY_VERIFIED)
  @Public()
  @HttpCode(200)
  @Patch(CandidateController.rootRoute + ':id/send-verification-code')
  async resendOTP(@Param('id') id: string) {
    return await this.candidateService.sendCandidateOTP(id);
  }

  @ApiOperation({ summary: 'Get candidate by contact number' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_CONTACT_NUMBER)
  @Public()
  @HttpCode(200)
  @Get(CandidateController.rootRoute + 'contact-number/:contactNumber')
  async getByContactNumber(
    @Param('contactNumber') contactNumber: string,
  ): Promise<CandidateRespDto> {
    return await this.candidateService.getCandidateByContactNumber(
      contactNumber,
    );
  }

  @ApiOperation({ summary: 'Get candidate by Id' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @Roles(Role.CANDIDATE, Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
  @HttpCode(200)
  @Get(CandidateController.rootRoute + ':id')
  async get(@Param('id') id: string): Promise<CandidateRespDto> {
    return await this.candidateService.getCandidateById(id);
  }

  @ApiOperation({
    summary: 'Search candidates by name and organization',
  })
  @ApiResponse(CandidateResponseCodes.SUCCESS)
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_ORGANIZATION_ID)
  @Roles(Role.ADMIN, Role.MEMBER)
  @HttpCode(200)
  @Get('organization/:organizationId/' + CandidateController.rootRoute)
  async search(
    @Param('organizationId') organizationId: string,
    @Query('name') name: string,
  ) {
    return await this.candidateService.searchByNameForOrganization(
      organizationId,
      name,
    );
  }

  @ApiOperation({ summary: 'Get candidate assessment by assessment token' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateAssessmentRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_TIMED_OUT)
  @HttpCode(200)
  @Get(CandidateController.rootRoute + ':id/assessment/token/:token')
  async getCandidateAssessmentByToken(
    @Param('id') id: string,
    @Param('token') token: string,
  ): Promise<CandidateAssessmentRespDto> {
    return await this.candidateService.getCandidateAssessmentByToken(id, token);
  }

  @ApiOperation({ summary: 'Get candidate assessment by assessment id' })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateAssessmentRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS)
  @Roles(Role.CANDIDATE, Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
  @HttpCode(200)
  @Get(CandidateController.rootRoute + ':id/assessment/:assessmentId')
  async getCandidateAssessmentByAssessmentId(
    @Param('id') id: string,
    @Param('assessmentId') assessmentId: string,
  ): Promise<CandidateAssessmentRespDto> {
    return await this.candidateService.getCandidateAssessmentByAssessmentId(
      id,
      assessmentId,
    );
  }

  @ApiOperation({ summary: 'Create candidate assessment' })
  @ApiResponse({ ...CandidateResponseCodes.CREATED, type: Number })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_EXISTS)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_TOKEN)
  @ApiResponse(CandidateResponseCodes.ASSESSMENT_ACTION_DENIED)
  @ApiProduces('application/text')
  @HttpCode(201)
  @Post(CandidateController.rootRoute + ':id/assessment/token/:token')
  async createAssessment(
    @Param('id') id: string,
    @Param('token') token: string,
  ): Promise<string> {
    return await this.candidateService.createCandidateAssessment(id, token);
  }

  @ApiOperation({ summary: 'Log candidate assessment attempt' })
  @ApiResponse({ ...CandidateResponseCodes.CREATED })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiProduces('application/text')
  @HttpCode(201)
  @Post(
    CandidateController.rootRoute + ':id/assessment/:assessmentId/attempt/log',
  )
  async logAssessmentAttempt(
    @Param('id') id: string,
    @Param('assessmentId') assessmentId: string,
  ): Promise<void> {
    return await this.candidateService.logAssessmentAttempt(id, assessmentId);
  }

  @ApiOperation({ summary: 'Update candidate profile' })
  @ApiResponse({ ...CandidateResponseCodes.SUCCESS })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_PHOTO_FILE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_VIDEO_FILE_ID)
  @HttpCode(200)
  @Patch(CandidateController.rootRoute + ':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateCandidateProfileReqDto: UpdateCandidateProfileReqDto,
  ) {
    return await this.candidateService.updateCandidateProfile(
      id,
      updateCandidateProfileReqDto,
    );
  }

  @ApiOperation({ summary: 'Set active assessment block' })
  @ApiResponse(CandidateResponseCodes.SUCCESS)
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @HttpCode(200)
  @Patch(
    CandidateController.rootRoute +
    'candidate-assessment/:candidateAssessmentId/assessment-block/:assessmentBlockId/active',
  )
  async setActiveAssessmentBlock(
    @Param('candidateAssessmentId') candidateAssessmentId: string,
    @Param('assessmentBlockId') assessmentBlockId: string,
  ) {
    return await this.candidateService.setActiveAssessmentBlock(
      candidateAssessmentId,
      assessmentBlockId,
    );
  }

  @ApiOperation({ summary: 'Mark assessment complete' })
  @ApiResponse(CandidateResponseCodes.SUCCESS)
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID)
  @HttpCode(200)
  @Patch(
    CandidateController.rootRoute +
    'candidate-assessment/:candidateAssessmentId/complete',
  )
  async markAssessmentComplete(
    @Param('candidateAssessmentId') candidateAssessmentId: string,
  ) {
    return await this.candidateService.markCandidateAssessmentComplete(
      candidateAssessmentId,
    );
  }

  @ApiOperation({ summary: 'Submit answer' })
  @ApiResponse(CandidateResponseCodes.SUCCESS)
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ASSESSMENT_ID)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_ACTION_DENIED)
  @ApiResponse(CandidateResponseCodes.INVALID_QUESTION_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_ANSWER_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_VIDEO_FILE_ID)
  @ApiResponse(CandidateResponseCodes.ANSWER_RESPONSE_INCORRECT)
  @HttpCode(200)
  @Put(
    CandidateController.rootRoute +
    'candidate-assessment/:candidateAssessmentId/question/:questionId/submit-answer',
  )
  async submitAnswer(
    @Param('candidateAssessmentId') candidateAssessmentId: string,
    @Param('questionId') questionId: string,
    @Body() submitAnswerReqDto: SubmitAnswerReqDto,
  ) {
    return await this.candidateService.submitAnswer(
      candidateAssessmentId,
      questionId,
      submitAnswerReqDto,
    );
  }

  @ApiOperation({
    summary: 'Get candidate responses for question',
  })
  @ApiResponse({
    ...CandidateResponseCodes.SUCCESS,
    type: CandidateResponseRespDto,
  })
  @ApiResponse(CandidateResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(CandidateResponseCodes.INVALID_QUESTION_ID)
  @Roles(Role.ADMIN, Role.MEMBER, Role.CANDIDATE)
  @HttpCode(200)
  @Get(
    CandidateController.rootRoute +
    'candidate-assessment/:candidateAssessmentId/question/:questionId/candidate-response',
  )
  async getResponsesForQuestion(
    @Param('candidateAssessmentId') candidateAssessmentId: string,
    @Param('questionId') questionId: string,
  ): Promise<CandidateResponseRespDto[]> {
    return await this.candidateService.getResponsesByQuestionId(
      candidateAssessmentId,
      questionId,
    );
  }
}
