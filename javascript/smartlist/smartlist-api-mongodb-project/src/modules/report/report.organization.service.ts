import { Injectable } from '@nestjs/common';
import { AssessmentDecisionSummaryRespDto } from './dto/response/assessment-decision-summary.resp.dto';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { ReportResponseCodes } from './report.response.codes';
import { AssessmentSummaryRespDto } from './dto/response/assessment-summary.resp.dto';
import {
  getDateAtSOD,
  getDateAtEOD,
} from 'src/utils/date.utils';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { TimeSeriesDataRespDto } from './dto/response/time-series-data.resp.dto';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { ReportDocumentRepository } from './report.document.repository';
import { OrganizationDocument } from 'src/schemas/organization.schema';

@Injectable()
export class ReportOrganizationService {
  constructor(
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private reportDocumentRepository: ReportDocumentRepository,
  ) {
  }

  async getHighLevelSummary(
    organizationId: string,
    from: Date,
    to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const uniqueAssessments: number =
      await this.reportDocumentRepository.getCountAttempted(
        organizationId,
        null,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const candidateSubmissions: number =
      await this.reportDocumentRepository.getCountCompleted(
        organizationId,
        null,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const smartlisted: number = await this.reportDocumentRepository.getCountSmartListed(
      organizationId,
      null,
      getDateAtSOD(from),
      getDateAtEOD(to),
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
    organizationId: string,
    from: Date,
    to: Date,
  ): Promise<RateSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const highLevelSummaryRespDto: HighLevelSummaryRespDto =
      await this.getHighLevelSummary(organizationId, from, to);

    const canididatesMeetingBasicCriteria: number =
      await this.reportDocumentRepository.getCountMeetingBasicRequirements(
        organizationId,
        null,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const registerationCount: number =
      await this.reportDocumentRepository.getCountRegistered(organizationId, null);

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
    organizationId: string,
    status: AssessmentStatus,
    from: Date,
    to: Date,
  ): Promise<AssessmentSummaryRespDto[]> {
    await this.findOrganizationOrThrow(organizationId);
    this.throwIfAssesmentStatusInvalid(status);

    const arrData: AssessmentSummaryRespDto[] = [];
    const rawData = await this.reportDocumentRepository.getAllAssessmentSummaryByStatus(
      organizationId,
      status,
      getDateAtSOD(from),
      getDateAtEOD(to),
    );
    for (let i = 0; i < rawData.length; i++) {
      arrData.push(new AssessmentSummaryRespDto(rawData[i]));
    }

    return arrData;
  }

  async getAssessmentDecisionSummariesForOrganizationByStatus(
    organizationId: string,
    status: AssessmentStatus,
  ): Promise<AssessmentDecisionSummaryRespDto[]> {
    this.findOrganizationOrThrow(organizationId);
    this.throwIfAssesmentStatusInvalid(status);

    const arrData: AssessmentDecisionSummaryRespDto[] = [];
    const rawDataAssessmentDecision =
      await this.reportDocumentRepository.getAssessmentDecisionSummariesForOrganizationByStatus(
        organizationId,
        status,
      );

    const rawDataAssessmentStatus =
      await this.reportDocumentRepository.getAssessmentStatusSummariesForOrganizationByStatus(
        organizationId,
        status,
      );

    rawDataAssessmentDecision.map((item1, i) => {
      rawDataAssessmentStatus.map((item2, j) => {
        if (item1.assessmentId.toString() === item2.assessmentId.toString()) {
          rawDataAssessmentDecision[i] = Object.assign({}, item1, item2);
        }
      });
    });


    for (let i = 0; i < rawDataAssessmentDecision.length; i++) {
      arrData.push(new AssessmentDecisionSummaryRespDto(rawDataAssessmentDecision[i]));
    }

    return arrData;
  }


  async getTimeSeriesSummaryForOrganization(
    organizationId: string,
    from: Date,
    to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    await this.findOrganizationOrThrow(organizationId);

    const arrCountOfAttempts: TimeSeriesDataRespDto[] = [];
    const arrCountOfSubmissions: TimeSeriesDataRespDto[] = [];

    let rawData =
      await this.reportDocumentRepository.getTimeSeriesCountRegisteredByDate(
        organizationId,
        null,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrCountOfAttempts.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    rawData = await this.reportDocumentRepository.getTimeSeriesCountSubmittedByDate(
      organizationId,
      null,
      getDateAtSOD(from),
      getDateAtEOD(to),
    );
    for (let i = 0; i < rawData.length; i++) {
      arrCountOfSubmissions.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    return new TimeSeriesSummaryRespDto(
      arrCountOfAttempts,
      arrCountOfSubmissions,
    );
  }

  private async findOrganizationOrThrow(organizationId: string) {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    if (organizationDocument == null) {
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
