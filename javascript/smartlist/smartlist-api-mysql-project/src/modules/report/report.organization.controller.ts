import {
  Controller,
  Get,
  Param,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportOrganizationService } from './report.organization.service';
import { ReportResponseCodes } from './report.response.codes';
import { AssessmentDecisionSummaryRespDto } from './dto/response/assessment-decision-summary.resp.dto';
import { AssessmentSummaryRespDto } from './dto/response/assessment-summary.resp.dto';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { Role } from 'src/enums/role';
import { Roles } from 'src/guards/roles.decorator';

@Controller('report/organization/')
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.MEMBER)
export class ReportOrganizationController {
  constructor(
    private readonly reportOrganizationService: ReportOrganizationService,
  ) {}

  @ApiOperation({
    summary: 'Get high level summary by organization and date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [HighLevelSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get(':organizationId/highlevel/summary')
  async getOrganizationHighLevelSummary(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    return await this.reportOrganizationService.getHighLevelSummary(
      organizationId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get rate summary for organization by date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [RateSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get(':organizationId/rate/summary')
  async getOrganizationRateSummary(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<RateSummaryRespDto> {
    return await this.reportOrganizationService.getRateSummary(
      organizationId,
      from,
      to,
    );
  }

  @ApiOperation({
    summary:
      'Get assessment summaries for organization by status and date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_STATUS)
  @ApiResponse(ReportResponseCodes.INVALID_DATE)
  @HttpCode(200)
  @Get(':organizationId/assessment/summary')
  async getAllAssessmentSummaryByStatus(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('status') status: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<AssessmentSummaryRespDto[]> {
    return await this.reportOrganizationService.getAllAssessmentSummaryByStatus(
      organizationId,
      status,
      from,
      to,
    );
  }

  @ApiOperation({
    summary: 'Get assessment decision summaries by organization',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [AssessmentDecisionSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ORGANIZATION_ID)
  @ApiResponse(ReportResponseCodes.INVALID_ASSESSMENT_STATUS)
  @HttpCode(200)
  @Get(':organizationId/decision/summary')
  async getAssessmentDecisionSummariesForOrganizationByStatus(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('status') status: string,
  ): Promise<AssessmentDecisionSummaryRespDto[]> {
    return await this.reportOrganizationService.getAssessmentDecisionSummariesForOrganizationByStatus(
      organizationId,
      status,
    );
  }

  @ApiOperation({
    summary: 'Time series data for assessments by organization and date range',
  })
  @ApiResponse({
    ...ReportResponseCodes.SUCCESS,
    type: [TimeSeriesSummaryRespDto],
  })
  @ApiResponse(ReportResponseCodes.BAD_REQUEST)
  @ApiResponse(ReportResponseCodes.INVALID_ORGANIZATION_ID)
  @HttpCode(200)
  @Get(':organizationId/timeseries/data')
  async getTimeSeriesSummaryForOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    return await this.reportOrganizationService.getTimeSeriesSummaryForOrganization(
      organizationId,
      from,
      to,
    );
  }
}
