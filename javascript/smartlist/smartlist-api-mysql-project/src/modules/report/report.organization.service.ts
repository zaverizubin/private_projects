import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssessmentDecisionSummaryRespDto } from './dto/response/assessment-decision-summary.resp.dto';
import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { GradingRepository } from '../grading/grading.repository';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { ReportResponseCodes } from './report.response.codes';
import { AssessmentSummaryRespDto } from './dto/response/assessment-summary.resp.dto';

import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { ReportRepository } from './report.repository';
import { getCustomRepository } from 'typeorm';
import { OrganizationRepository } from '../organization/organization.repository';
import { Organization } from 'src/entities/organization.entity';
import {
  getISOFormattedDateAtEOD,
  getISOFormattedDateAtSOD,
} from 'src/utils/date.utils';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { TimeSeriesDataRespDto } from './dto/response/time-series-data.resp.dto';

@Injectable()
export class ReportOrganizationService {
  private reportRepository: ReportRepository;

  constructor(
    @InjectRepository(AssessmentBlockRepository)
    private assessmentBlockRepository: AssessmentBlockRepository,
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
    @InjectRepository(CandidateAssessmentRepository)
    private candidateAssessmentRepository: CandidateAssessmentRepository,
    @InjectRepository(GradingRepository)
    private gradingRepository: GradingRepository,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
  ) {
    this.reportRepository = getCustomRepository(ReportRepository);
  }

  async getHighLevelSummary(
    organizationId: number,
    from: Date,
    to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const uniqueAssessments: number =
      await this.reportRepository.getCountAttempted(
        organizationId,
        null,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const candidateSubmissions: number =
      await this.reportRepository.getCountCompleted(
        organizationId,
        null,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const smartlisted: number = await this.reportRepository.getCountSmartListed(
      organizationId,
      null,
      getISOFormattedDateAtSOD(from),
      getISOFormattedDateAtEOD(to),
    );

    const highLevelSummaryRespDto: HighLevelSummaryRespDto =
      new HighLevelSummaryRespDto(
        uniqueAssessments,
        candidateSubmissions,
        smartlisted,
      );

    return highLevelSummaryRespDto;
  }

  async getRateSummary(
    organizationId: number,
    from: Date,
    to: Date,
  ): Promise<RateSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const highLevelSummaryRespDto: HighLevelSummaryRespDto =
      await this.getHighLevelSummary(organizationId, from, to);

    const canididatesMeetingBasicCriteria: number =
      await this.reportRepository.getCountMeetingBasicRequirements(
        organizationId,
        null,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const registerationCount: number =
      await this.reportRepository.getCountRegistered(organizationId, null);

    const responseRate: number = Math.round(
      (highLevelSummaryRespDto.candidate_submissions * 100) /
        highLevelSummaryRespDto.unique_assessments,
    );

    const qualificationRate: number = Math.round(
      (canididatesMeetingBasicCriteria * 100) /
        highLevelSummaryRespDto.candidate_submissions,
    );

    const smartlistRate: number = Math.round(
      (highLevelSummaryRespDto.candidates_smartlisted * 100) /
        highLevelSummaryRespDto.candidate_submissions,
    );

    const rateSummaryRespDto: RateSummaryRespDto = new RateSummaryRespDto(
      responseRate,
      qualificationRate,
      smartlistRate,
      registerationCount,
    );

    return rateSummaryRespDto;
  }

  async getAllAssessmentSummaryByStatus(
    organizationId: number,
    status: string,
    from: Date,
    to: Date,
  ): Promise<AssessmentSummaryRespDto[]> {
    await this.findOrganizationOrThrow(organizationId);
    this.throwIfAssesmentStatusInvalid(status);

    const arrData: AssessmentSummaryRespDto[] = [];
    const rawData = await this.reportRepository.getAllAssessmentSummaryByStatus(
      organizationId,
      status,
      getISOFormattedDateAtSOD(from),
      getISOFormattedDateAtEOD(to),
    );
    for (let i = 0; i < rawData.length; i++) {
      arrData.push(new AssessmentSummaryRespDto(rawData[i]));
    }

    return arrData;
  }

  async getAssessmentDecisionSummariesForOrganizationByStatus(
    organizationId: number,
    status: string,
  ): Promise<AssessmentDecisionSummaryRespDto[]> {
    this.findOrganizationOrThrow(organizationId);
    this.throwIfAssesmentStatusInvalid(status);

    const arrData: AssessmentDecisionSummaryRespDto[] = [];
    const rawDataAssessmentDecision =
      await this.reportRepository.getAssessmentDecisionSummariesForOrganizationByStatus(
        organizationId,
        status,
      );

    const rawDataAssessmentStatus =
      await this.reportRepository.getAssessmentStatusSummariesForOrganizationByStatus(
        organizationId,
        status,
      );

    const rawData = this.mergeArrayObjects(
      rawDataAssessmentDecision,
      rawDataAssessmentStatus,
    );

    for (let i = 0; i < rawData.length; i++) {
      arrData.push(new AssessmentDecisionSummaryRespDto(rawData[i]));
    }

    return arrData;
  }

  mergeArrayObjects(arr1, arr2) {
    return arr1.map((item, i) => {
      if (item.id === arr2[i].id) {
        //merging two objects
        return Object.assign({}, item, arr2[i]);
      }
    });
  }

  async getTimeSeriesSummaryForOrganization(
    organizationId: number,
    from: Date,
    to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const arrCountOfAttempts: TimeSeriesDataRespDto[] = [];
    const arrCountOfSubmissions: TimeSeriesDataRespDto[] = [];

    let rawData =
      await this.reportRepository.getTimeSeriesCountRegisteredByDate(
        organizationId,
        null,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrCountOfAttempts.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    rawData = await this.reportRepository.getTimeSeriesCountSubmittedByDate(
      organizationId,
      null,
      getISOFormattedDateAtSOD(from),
      getISOFormattedDateAtEOD(to),
    );
    for (let i = 0; i < rawData.length; i++) {
      arrCountOfSubmissions.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    return new TimeSeriesSummaryRespDto(
      arrCountOfAttempts,
      arrCountOfSubmissions,
    );
  }

  private async findOrganizationOrThrow(organizationId: number) {
    const organization: Organization =
      await this.organizationRepository.findOne(organizationId);
    if (organization == null) {
      throw ReportResponseCodes.INVALID_ORGANIZATION_ID;
    }
  }

  private throwIfAssesmentStatusInvalid(status: string) {
    if (
      status != AssessmentStatus.ACTIVE &&
      status != AssessmentStatus.ARCHIVED
    ) {
      throw ReportResponseCodes.INVALID_ASSESSMENT_STATUS;
    }
  }
}
