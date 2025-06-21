import { Injectable } from '@nestjs/common';
import { AssessmentBlockCandidatePerformanceRespDto } from './dto/response/assessment-block-candidate-performance.resp.dto';
import { AssessmentCandidatePerformanceRespDto } from './dto/response/assessment-candidate-performance.resp.dto';
import { AssessmentStatusSummaryRespDto } from './dto/response/assessment-status-summary.resp.dto';
import { AssessmentBlockAverageScoreRespDto } from './dto/response/assessment-block-average-score.resp.dto';
import { ReportResponseCodes } from './report.response.codes';
import {
  getDateAtEOD,
  getDateAtSOD,
} from 'src/utils/date.utils';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { TimeSeriesDataRespDto } from './dto/response/time-series-data.resp.dto';
import { ReportCandidateService } from './report.candidate.service';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { ReportDocumentRepository } from './report.document.repository';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';

@Injectable()
export class ReportAssessmentService {

  constructor(
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
    private reportDocumentRepository: ReportDocumentRepository,
    private reportCandidateService: ReportCandidateService,
  ) {

  }

  async getHighLevelSummary(
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const uniqueAssessments: number =
      await this.reportDocumentRepository.getCountAttempted(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const candidateSubmissions: number =
      await this.reportDocumentRepository.getCountCompleted(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const smartlisted: number = await this.reportDocumentRepository.getCountSmartListed(
      null,
      assessmentId,
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
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<RateSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const highLevelSummaryRespDto: HighLevelSummaryRespDto =
      await this.getHighLevelSummary(assessmentId, from, to);

    const canididatesMeetingBasicCriteria: number =
      await this.reportDocumentRepository.getCountMeetingBasicRequirements(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const registerationCount: number =
      await this.reportDocumentRepository.getCountRegistered(null, assessmentId);

    const responseRate: number =
      (highLevelSummaryRespDto.candidate_submissions * 100) /
      highLevelSummaryRespDto.unique_assessments;

    const qualificationRate: number =
      (canididatesMeetingBasicCriteria * 100) /
      highLevelSummaryRespDto.candidate_submissions;

    const smartlistRate: number =
      (highLevelSummaryRespDto.candidates_smartlisted * 100) /
      highLevelSummaryRespDto.candidate_submissions;

    const rateSummaryRespDto: RateSummaryRespDto = new RateSummaryRespDto(
      responseRate,
      qualificationRate,
      smartlistRate,
      registerationCount,
    );

    return rateSummaryRespDto;
  }

  async getAssessmentStatusSummary(
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<AssessmentStatusSummaryRespDto> {
    const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(
      assessmentId,
    );

    const countOfCompletedAssessments: number =
      await this.reportDocumentRepository.getCountOfCompletedAssessments(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const countOfCandidateAssessments: number =
      await this.reportDocumentRepository.getCountAttempted(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const responseRate: number = countOfCandidateAssessments
      ? Math.round(
        (100 * countOfCompletedAssessments) / countOfCandidateAssessments,
      )
      : 0;

    const countOfCanididatesMeetingBasicCriteria: number =
      await this.reportDocumentRepository.getCountMeetingBasicRequirements(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const completionRate: number = countOfCompletedAssessments
      ? Math.round(
        (100 * countOfCanididatesMeetingBasicCriteria) /
        countOfCompletedAssessments,
      )
      : 0;

    const countOfSmartListedCandidates: number =
      await this.reportDocumentRepository.getCountSmartListed(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const smartlistedRate: number = countOfCompletedAssessments
      ? Math.round(
        100 * (countOfSmartListedCandidates / countOfCompletedAssessments),
      )
      : 0;

    return new AssessmentStatusSummaryRespDto(
      responseRate,
      completionRate,
      smartlistedRate,
    );
  }

  async getAssessmentBlockAverageScore(
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<AssessmentBlockAverageScoreRespDto[]> {
    const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(
      assessmentId,
    );

    const arrData: AssessmentBlockAverageScoreRespDto[] = [];
    const assessmentBlockSumOfScores: any[] = [];
    const maxPossibleAssessmentBlockScores: any[] = [];

    let rawData =
      await this.reportDocumentRepository.getAssessmentBlockSumOfScoresForAssessment(
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    const completedCount: number =
      await this.candidateAssessmentDocumentRepository.getCountOfCompletedAssessments(
        assessmentDocument,
      );

    for (let i = 0; i < rawData.length; i++) {
      const obj: any = {
        assessmentBlockId: rawData[i].assessmentBlockId,
        title: rawData[i].title,
        score: rawData[i].score,
      };
      assessmentBlockSumOfScores.push(obj);
    }

    rawData = await this.reportCandidateService.getMaxBlockAvgScore(assessmentDocument);

    for (let i = 0; i < rawData.length; i++) {
      const obj: any = {
        assessmentBlockId: rawData[i].assessmentBlockId,
        title: rawData[i].title,
        score: rawData[i].score,
      };
      maxPossibleAssessmentBlockScores.push(obj);
    }

    //Calculate Assessment block average scores as a percentage
    const assessmentBlockScores: any = [];
    maxPossibleAssessmentBlockScores.forEach((mpabs) => {
      const abss: any = assessmentBlockSumOfScores.find((obj) => {
        return obj.assessmentBlockId.toString() == mpabs.assessmentBlockId.toString();
      });

      assessmentBlockScores.push({
        assessmentBlockId: mpabs.assessmentBlockId,
        title: mpabs.title,
        score:
          abss != null
            ? Math.round(((abss.score / completedCount) * 100) / mpabs.score)
            : 0,
      });
    });

    for (let i = 0; i < assessmentBlockScores.length; i++) {
      arrData.push(
        new AssessmentBlockAverageScoreRespDto(assessmentBlockScores[i]),
      );
    }

    return arrData;
  }

  async getAssessmentPerformanceForAllCandidates(
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<AssessmentCandidatePerformanceRespDto[]> {
    await this.findAssessmentOrThrow(assessmentId);

    const arrData: AssessmentCandidatePerformanceRespDto[] = [];
    let rawData =
      await this.reportDocumentRepository.getAssessmentPerformanceForAllCandidates(
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i].status == CandidateAssessmentStatus.GRADING_COMPLETED) {
        const reportData =
          await this.reportCandidateService.generateCandidateReportData(
            rawData[i].id,
            assessmentId,
          );
        rawData[i].group_average_score = reportData.group_average_score;
        rawData[i].candidate_average_score = reportData.candidate_average_score;
      } else {
        rawData[i].group_average_score = 0;
        rawData[i].candidate_average_score = 0;
      }

      arrData.push(new AssessmentCandidatePerformanceRespDto(rawData[i]));
    }

    rawData = await this.reportDocumentRepository.getLastSubmissionDateForAllCandidates(
      assessmentId,
    );

    for (let i = 0; i < rawData.length; i++) {
      const performanceDto: AssessmentCandidatePerformanceRespDto =
        arrData.find((d) => d.id == rawData[i].id);
      if (performanceDto) {
        performanceDto.last_submission_date = rawData[i].last_submission_date;
      }
    }

    return arrData;
  }

  async getAssessmentBlockPerformanceForAllCandidates(
    assessmentBlockId: string,
    from: Date,
    to: Date,
  ): Promise<AssessmentBlockCandidatePerformanceRespDto[]> {
    await this.findAssessmentBlockOrThrow(assessmentBlockId);

    const arrData: AssessmentBlockCandidatePerformanceRespDto[] = [];
    const rawData =
      await this.reportDocumentRepository.getAssessmentBlockPerformanceForAllCandidates(
        assessmentBlockId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrData.push(new AssessmentBlockCandidatePerformanceRespDto(rawData[i]));
    }

    return arrData;
  }

  async getTimeSeriesSummaryForAssessment(
    assessmentId: string,
    from: Date,
    to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const arrCountOfAttempts: TimeSeriesDataRespDto[] = [];
    const arrCountOfSubmissions: TimeSeriesDataRespDto[] = [];

    let rawData =
      await this.reportDocumentRepository.getTimeSeriesCountRegisteredByDate(
        null,
        assessmentId,
        getDateAtSOD(from),
        getDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrCountOfAttempts.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    rawData = await this.reportDocumentRepository.getTimeSeriesCountSubmittedByDate(
      null,
      assessmentId,
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

  private async findAssessmentOrThrow(
    assessmentId: string,
  ): Promise<AssessmentDocument> {
    const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(
      assessmentId,
    );
    if (assessmentDocument == null) {
      throw ReportResponseCodes.INVALID_ASSESSMENT_ID;
    }
    return assessmentDocument;
  }

  private async findAssessmentBlockOrThrow(
    assessmentBlockId: string,
  ): Promise<AssessmentBlockDocument> {
    const assessmentDocumentBlock: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
    if (assessmentDocumentBlock == null) {
      throw ReportResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
    return assessmentDocumentBlock;
  }
}
