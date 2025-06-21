import {
  Controller,
  Get,
  Param,
  HttpCode,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportResponseCodes } from './report.response.codes';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { ReportCandidateService } from './report.candidate.service';
import { CandidateAssessmentReportRespDto } from './dto/response/candidate-assessment-report.resp.dto';
import { Response } from 'express';
import { CandidateResponseCodes } from '../candidate/candidate.response.codes';
import { setDataAndHeaderInRes } from 'src/utils/file.utils';

@Controller('report/')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class ReportCandidateController {
  constructor(
    private readonly reportCandidateService: ReportCandidateService,
  ) {}

  @ApiOperation({
    summary: 'Get candidate assessment report',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [HighLevelSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId')
  async getCandidateScoreForAssessmentBlocks(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ): Promise<CandidateAssessmentReportRespDto> {
    return await this.reportCandidateService.getCandidateAssessmentReport(
      candidateId,
      assessmentId,
    );
  }

  @ApiOperation({
    summary: 'Get candidate assessment report PDF',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId/pdf')
  async downloadCandidateAssessmentReport(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
    @Res() res: Response,
  ): Promise<Response> {
    const buffer =
      await this.reportCandidateService.getCandidateAssessmentReportAsPDF(
        candidateId,
        assessmentId,
      );
    return setDataAndHeaderInRes(res, buffer, 'candidateassessment');
  }

  @ApiOperation({
    summary: 'Send candidate assessment report by mail',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(CandidateResponseCodes.INVALID_CANDIDATE_ID)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(CandidateResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS)
  @HttpCode(200)
  @Get('candidate/:candidateId/assessment/:assessmentId/mail')
  async sendCandidateAssessmentReportMail(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
  ): Promise<boolean> {
    return await this.reportCandidateService.sendCandidateAssessmentReportMail(
      candidateId,
      assessmentId,
    );
  }
}
