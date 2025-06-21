import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssessmentBlockCandidatePerformanceRespDto } from './dto/response/assessment-block-candidate-performance.resp.dto';
import { AssessmentCandidatePerformanceRespDto } from './dto/response/assessment-candidate-performance.resp.dto';
import { AssessmentStatusSummaryRespDto } from './dto/response/assessment-status-summary.resp.dto';
import { AssessmentBlockAverageScoreRespDto } from './dto/response/assessment-block-average-score.resp.dto';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { GradingRepository } from '../grading/grading.repository';
import { ReportResponseCodes } from './report.response.codes';
import { AssessmentBlockRepository } from '../assessment-block/assessment-block.repository';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { ReportRepository } from './report.repository';
import { getCustomRepository } from 'typeorm';
import { OrganizationRepository } from '../organization/organization.repository';
import {
  getISOFormattedDateAtEOD,
  getISOFormattedDateAtSOD,
} from 'src/utils/date.utils';
import { HighLevelSummaryRespDto } from './dto/response/highlevel-summary.resp.dto';
import { RateSummaryRespDto } from './dto/response/rate-summary.resp.dto';
import { TimeSeriesSummaryRespDto } from './dto/response/time-series-summary.resp.dto';
import { TimeSeriesDataRespDto } from './dto/response/time-series-data.resp.dto';
import { ReportCandidateService } from './report.candidate.service';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';

@Injectable()
export class ReportAssessmentService {
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
    private reportCandidateService: ReportCandidateService,
  ) {
    this.reportRepository = getCustomRepository(ReportRepository);
  }

  async getHighLevelSummary(
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<HighLevelSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const uniqueAssessments: number =
      await this.reportRepository.getCountAttempted(
        null,
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const candidateSubmissions: number =
      await this.reportRepository.getCountCompleted(
        null,
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const smartlisted: number = await this.reportRepository.getCountSmartListed(
      null,
      assessmentId,
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
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<RateSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const highLevelSummaryRespDto: HighLevelSummaryRespDto =
      await this.getHighLevelSummary(assessmentId, from, to);

    const canididatesMeetingBasicCriteria: number =
      await this.reportRepository.getCountMeetingBasicRequirements(
        null,
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const registerationCount: number =
      await this.reportRepository.getCountRegistered(null, assessmentId);

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
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<AssessmentStatusSummaryRespDto> {
    const assessment: Assessment = await this.findAssessmentOrThrow(
      assessmentId,
    );

    const countOfCompletedAssessments: number =
      await this.reportRepository.getCountOfCompletedAssessments(
        null,
        assessment.id,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const countOfCandidateAssessments: number =
      await this.reportRepository.getCountAttempted(
        null,
        assessment.id,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const responseRate: number = countOfCandidateAssessments
      ? Math.round(
          (100 * countOfCompletedAssessments) / countOfCandidateAssessments,
        )
      : 0;

    const countOfCanididatesMeetingBasicCriteria: number =
      await this.reportRepository.getCountMeetingBasicRequirements(
        null,
        assessment.id,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const completionRate: number = countOfCompletedAssessments
      ? Math.round(
          (100 * countOfCanididatesMeetingBasicCriteria) /
            countOfCompletedAssessments,
        )
      : 0;

    const countOfSmartListedCandidates: number =
      await this.reportRepository.getCountSmartListed(
        null,
        assessment.id,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
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
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<AssessmentBlockAverageScoreRespDto[]> {
    const assessment: Assessment = await this.findAssessmentOrThrow(
      assessmentId,
    );

    const arrData: AssessmentBlockAverageScoreRespDto[] = [];
    const assessmentBlockSumOfScores: any[] = [];
    const maxPossibleAssessmentBlockScores: any[] = [];

    let rawData =
      await this.reportRepository.getAssessmentBlockSumOfScoresForAssessment(
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    const completedCount: number =
      await this.candidateAssessmentRepository.getCountOfCompletedAssessments(
        assessment,
      );

    for (let i = 0; i < rawData.length; i++) {
      const obj: any = {
        assessmentBlockId: rawData[i].assessmentBlockId,
        title: rawData[i].title,
        score: rawData[i].score,
      };
      assessmentBlockSumOfScores.push(obj);
    }

    rawData =
      await this.reportRepository.getMaxPossibleAssessmentBlockScoresForAssessment(
        assessmentId,
      );

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
        return obj.assessmentBlockId == mpabs.assessmentBlockId;
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
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<AssessmentCandidatePerformanceRespDto[]> {
    await this.findAssessmentOrThrow(assessmentId);

    const arrData: AssessmentCandidatePerformanceRespDto[] = [];
    let rawData =
      await this.reportRepository.getAssessmentPerformanceForAllCandidates(
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i].status == CandidateAssessmentStatus.GRADING_COMPLETED) {
        const reportData =
          await this.reportCandidateService.generateCandidateReportData(
            rawData[i].id,
            assessmentId,
          );
        rawData[i].groupAverageScore = reportData.group_average_score;
        rawData[i].candidateAverageScore = reportData.candidate_average_score;
      } else {
        rawData[i].groupAverageScore = 0;
        rawData[i].candidateAverageScore = 0;
      }

      arrData.push(new AssessmentCandidatePerformanceRespDto(rawData[i]));
    }

    rawData = await this.reportRepository.getLastSubmissionDateForAllCandidates(
      assessmentId,
    );

    for (let i = 0; i < rawData.length; i++) {
      const performanceDto: AssessmentCandidatePerformanceRespDto =
        arrData.find((d) => d.id == rawData[i].id);
      if (performanceDto) {
        performanceDto.last_submission_date = rawData[i].lastSubmissionDate;
      }
    }

    return arrData;
  }

  async getAssessmentBlockPerformanceForAllCandidates(
    assessmentBlockId: number,
    from: Date,
    to: Date,
  ): Promise<AssessmentBlockCandidatePerformanceRespDto[]> {
    await this.findAssessmentBlockOrThrow(assessmentBlockId);

    const arrData: AssessmentBlockCandidatePerformanceRespDto[] = [];
    const rawData =
      await this.reportRepository.getAssessmentBlockPerformanceForAllCandidates(
        assessmentBlockId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrData.push(new AssessmentBlockCandidatePerformanceRespDto(rawData[i]));
    }

    return arrData;
  }

  async getTimeSeriesSummaryForAssessment(
    assessmentId: number,
    from: Date,
    to: Date,
  ): Promise<TimeSeriesSummaryRespDto> {
    await this.findAssessmentOrThrow(assessmentId);

    const arrCountOfAttempts: TimeSeriesDataRespDto[] = [];
    const arrCountOfSubmissions: TimeSeriesDataRespDto[] = [];

    let rawData =
      await this.reportRepository.getTimeSeriesCountRegisteredByDate(
        null,
        assessmentId,
        getISOFormattedDateAtSOD(from),
        getISOFormattedDateAtEOD(to),
      );

    for (let i = 0; i < rawData.length; i++) {
      arrCountOfAttempts.push(new TimeSeriesDataRespDto(rawData[i]));
    }

    rawData = await this.reportRepository.getTimeSeriesCountSubmittedByDate(
      null,
      assessmentId,
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

  private async findAssessmentOrThrow(
    assessmentId: number,
  ): Promise<Assessment> {
    const assessment: Assessment = await this.assessmentRepository.findOne(
      assessmentId,
    );
    if (assessment == null) {
      throw ReportResponseCodes.INVALID_ASSESSMENT_ID;
    }
    return assessment;
  }

  private async findAssessmentBlockOrThrow(
    assessmentBlockId: number,
  ): Promise<AssessmentBlock> {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findOne(assessmentBlockId);
    if (assessmentBlock == null) {
      throw ReportResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
    return assessmentBlock;
  }
}
