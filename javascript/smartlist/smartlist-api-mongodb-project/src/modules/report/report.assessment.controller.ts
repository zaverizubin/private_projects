import {
  Controller,
  Get,
  Param,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportAssessmentService } from './report.assessment.service';
import { AssessmentBlockCandidatePerformanceRespDto } from './dto/response/assessment-block-candidate-performance.resp.dto';
import { AssessmentCandidatePerformanceRespDto } from './dto/response/assessment-candidate-performance.resp.dto';
import { AssessmentStatusSummaryRespDto } from './dto/response/assessment-status-summary.resp.dto';
import { AssessmentBlockAverageScoreRespDto } from './dto/response/assessment-block-average-score.resp.dto';
import { ReportResponseCodes } from './report.response.codes';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';
import { ReportDocumentRepository } from './report.document.repository';

@Controller('report/')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class ReportAssessmentController {
  constructor(
    private readonly reportAssessmentService: ReportAssessmentService,

    private reportDocumentRepository: ReportDocumentRepository,
  ) { }


  @Get('test/organization/:organizationId/assessment/:assessmentId')
  async test(
    @Param('organizationId') organizationId: string,
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<number> {
    return await this.reportDocumentRepository.getCountCompleted(
      organizationId,
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary:
      'Get high level summary by organization, assessment and date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [HighLevelSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment/:assessmentId/highlevel/summary')
  async getAssessmentHighLevelSummary(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    return await this.reportAssessmentService.getHighLevelSummary(
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get rate summary for organization and assessment by date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [RateSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment/:assessmentId/rate/summary')
  async getAssessmentRateSummary(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<RateSummaryRespDto> {
    return await this.reportAssessmentService.getRateSummary(
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({ summary: 'Get assessment status summary count' })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentStatusSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment/:assessmentId/status/summary')
  async getAssessmentStatusSummary(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<AssessmentStatusSummaryRespDto> {
    return await this.reportAssessmentService.getAssessmentStatusSummary(
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get assessment block average score for assessment',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentBlockAverageScoreRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment/:assessmentId/assessment-block/average-score')
  async getAssessmentBlockAverageScore(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<AssessmentBlockAverageScoreRespDto[]> {
    return await this.reportAssessmentService.getAssessmentBlockAverageScore(
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get assessment performance details for all candidates',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentCandidatePerformanceRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment/:assessmentId/candidate/performance')
  async getAssessmentPerformanceDetailsForAllCandidates(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<AssessmentCandidatePerformanceRespDto[]> {
    return await this.reportAssessmentService.getAssessmentPerformanceForAllCandidates(
      assessmentId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get assessment block performance details for all candidates',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentBlockCandidatePerformanceRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_BLOCK_ID)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get('assessment-block/:assessmentBlockId/candidate/performance')
  async getAssessmentBlockPerformanceDetailsForAllCandidates(
    @Param('assessmentBlockId') assessmentBlockId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<AssessmentBlockCandidatePerformanceRespDto[]> {
    return await this.reportAssessmentService.getAssessmentBlockPerformanceForAllCandidates(
      assessmentBlockId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Time series data for assessment by date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [TimeSeriesSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get('assessment/:assessmentId/timeseries/data')
  async getTimeSeriesSummaryForOrganization(
    @Param('assessmentId') assessmentId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    return await this.reportAssessmentService.getTimeSeriesSummaryForAssessment(
      assessmentId,
      from,
      to,
    );
  }
}
