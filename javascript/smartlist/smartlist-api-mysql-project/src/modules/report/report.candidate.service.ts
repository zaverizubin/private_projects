import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/entities/assessment.entity';
import { CandidateAssessmentRepository } from '../candidate/candidate.assessment.repository';
import { ReportResponseCodes } from './report.response.codes';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { ReportRepository } from './report.repository';
import { getCustomRepository } from 'typeorm';
import { CandidateAssessmentReportRespDto } from './dto/response/candidate-assessment-report.resp.dto';
import { Candidate } from 'src/entities/candidate.entity';
import { CandidateRepository } from '../candidate/candidate.repository';
import { EmailService } from 'src/providers/email.service';
import { FileService } from '../file/file.service';
import { generatePdf } from 'src/utils/file.utils';
import { CandidateAssessment } from 'src/entities/candidate-assessment.entity';
import {
  getEpochStartDate,
  getISOFormattedDateAtEOD,
  getISOFormattedDateAtSOD,
  getDateInISOFormattedDate,
} from 'src/utils/date.utils';
import { convertFirstLetterCapital } from 'src/utils/app.utils';
import { AssetFile } from 'src/entities/asset-file.entity';
import { FileRepository } from '../file/file.repository';
import * as fs from 'fs';
import * as path from 'path';
import { QuestionCommentRepository } from '../grading/question-comment.repository';
import { QuestionComment } from 'src/entities/question-comment.entity';
import { OrganizationRepository } from 'src/modules/organization/organization.repository';

@Injectable()
export class ReportCandidateService {
  private reportRepository: ReportRepository;

  constructor(
    @InjectRepository(CandidateRepository)
    private candidateRepository: CandidateRepository,
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
    @InjectRepository(CandidateAssessmentRepository)
    private candidateAssessmentRepository: CandidateAssessmentRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    @InjectRepository(QuestionCommentRepository)
    private questionCommentRepository: QuestionCommentRepository,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    private emailService: EmailService,
    private fileService: FileService,
  ) {
    this.reportRepository = getCustomRepository(ReportRepository);
  }

  async getCandidateAssessmentReport(
    candidateId: number,
    assessmentId: number,
  ): Promise<CandidateAssessmentReportRespDto> {
    return await this.generateCandidateReportData(candidateId, assessmentId);
  }

  async getCandidateAssessmentReportAsPDF(
    candidateId: number,
    assessmentId: number,
  ): Promise<Buffer> {
    const candidate: Candidate = await this.findCandidateOrThrow(candidateId);

    const candidateReportRespDto: CandidateAssessmentReportRespDto =
      await this.generateCandidateReportData(candidateId, assessmentId);

    let reportData: any = await this.addCandidateDemographicsToReport(
      candidate,
      candidateReportRespDto,
    );

    const logo = await this.getOrganizationPhoto(reportData, assessmentId);

    const questionComments: QuestionComment[] =
      await this.questionCommentRepository.findByCandidateAndAssessment(
        candidateId,
        assessmentId,
      );

    for (let i = 0; i < questionComments.length; i++) {
      questionComments[i].question.text = questionComments[
        i
      ].question.text.replace(/(<([^>]+)>)/gi, '');
    }
    reportData = {
      ...reportData,
      assessment_decision: convertFirstLetterCapital(
        reportData.assessment_decision,
      ),
      logo: logo,
      start_date: getDateInISOFormattedDate(reportData.start_date),
      questionComments,
    };
    //call generatePdf method with the data
    const filePath =
      __dirname + '/../../assets/report_templates/candidate_assessment.hbs';

    return await generatePdf(reportData, filePath);
  }

  async sendCandidateAssessmentReportMail(
    candidateId: number,
    assessmentId: number,
  ) {
    const candidate: Candidate = await this.findCandidateOrThrow(candidateId);

    const candidateReportRespDto: CandidateAssessmentReportRespDto =
      await this.generateCandidateReportData(candidateId, assessmentId);

    const reportData: any = await this.addCandidateDemographicsToReport(
      candidate,
      candidateReportRespDto,
    );

    // const logo = await this.getOrganizationPhoto(reportData, assessmentId);
    return await this.emailService.sendReportMail(
      reportData.email.toString(),
      reportData,
    );
  }

  async generateCandidateReportData(
    candidateId: number,
    assessmentId: number,
  ): Promise<CandidateAssessmentReportRespDto> {
    const candidate: Candidate = await this.findCandidateOrThrow(candidateId);
    const assessment: Assessment = await this.findAssessmentOrThrow(
      assessmentId,
    );

    const candidateAssessment = await this.findCandidateAssessmentOrThrow(
      candidate,
      assessment,
    );

    const assessmentBlockSumOfScores: any[] = [];
    const candidateAssessmentBlockScores: any[] = [];
    const maxPossibleAssessmentBlockScores: any[] = [];

    //Get all Score data
    let rawData =
      await this.reportRepository.getAssessmentBlockSumOfScoresForAssessment(
        assessmentId,
        getISOFormattedDateAtSOD(getEpochStartDate()),
        getISOFormattedDateAtEOD(new Date()),
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
      await this.reportRepository.getCandidateAssessmentBlockScoresForAssessment(
        candidateId,
        assessmentId,
      );

    let overallScore = 0;
    for (let i = 0; i < rawData.length; i++) {
      overallScore += Number(rawData[i].score);
      const obj: any = {
        assessmentBlockId: rawData[i].assessmentBlockId,
        title: rawData[i].title,
        score: rawData[i].score,
      };
      candidateAssessmentBlockScores.push(obj);
    }

    rawData =
      await this.reportRepository.getMaxPossibleAssessmentBlockScoresForAssessment(
        assessmentId,
      );

    let overallMaxScore = 0;
    for (let i = 0; i < rawData.length; i++) {
      overallMaxScore += Number(rawData[i].score);
      const obj: any = {
        assessmentBlockId: rawData[i].assessmentBlockId,
        title: rawData[i].title,
        score: rawData[i].score,
      };
      maxPossibleAssessmentBlockScores.push(obj);
    }

    const completedCount: number =
      await this.candidateAssessmentRepository.getCountOfCompletedAssessments(
        assessment,
      );

    //Calculate Assessment block average scores as a percentage
    const assessmentBlockScores: any = [];
    maxPossibleAssessmentBlockScores.forEach((mpabs) => {
      const abss: any = assessmentBlockSumOfScores.find((obj) => {
        return obj.assessmentBlockId == mpabs.assessmentBlockId;
      });
      const cabs: any = candidateAssessmentBlockScores.find((obj) => {
        return obj.assessmentBlockId == mpabs.assessmentBlockId;
      });
      assessmentBlockScores.push({
        title: mpabs.title,
        group_average_score:
          abss != null
            ? Math.round(((abss.score / completedCount) * 100) / mpabs.score)
            : 0,
        candidate_score:
          cabs != null ? Math.round((cabs.score * 100) / mpabs.score) : 0,
      });
    });

    //Calculate Asessment average scores as a percentage
    let groupAverageTotalScore = 0;
    assessmentBlockScores.forEach((obj: any) => {
      groupAverageTotalScore += obj.group_average_score;
    });
    const groupAverageScore: number = Math.round(
      groupAverageTotalScore / assessmentBlockScores.length,
    );

    let candidateAverageTotalScore = 0;
    assessmentBlockScores.forEach((obj: any) => {
      candidateAverageTotalScore += obj.candidate_score;
    });
    const candidateAverageScore: number = Math.round(
      candidateAverageTotalScore / assessmentBlockScores.length,
    );

    const candiateOverallScore = Math.round(
      (100 * overallScore) / overallMaxScore,
    );

    //compose report data
    const candidateAssessmentReportRespDto: CandidateAssessmentReportRespDto =
      new CandidateAssessmentReportRespDto();
    candidateAssessmentReportRespDto.start_date = candidateAssessment.startDate;
    candidateAssessmentReportRespDto.end_date = candidateAssessment.endDate;
    candidateAssessmentReportRespDto.assessment_decision =
      candidateAssessment.assessmentDecision;
    candidateAssessmentReportRespDto.group_average_score = groupAverageScore;
    candidateAssessmentReportRespDto.candidate_average_score =
      candidateAverageScore;
    candidateAssessmentReportRespDto.assessment_block_scores =
      assessmentBlockScores;
    candidateAssessmentReportRespDto.overall_score = candiateOverallScore;
    candidateAssessmentReportRespDto.assessment_name = assessment.name;

    return candidateAssessmentReportRespDto;
  }

  private async getOrganizationPhoto(reportData: any, assessmentId: number) {
    const assessment: Assessment =
      await this.assessmentRepository.findByIdWithRelations(assessmentId);
    const organization =
      await this.organizationRepository.findByIdWithRelations(
        assessment.organization.id,
      );
    if (organization.logo) {
      return await this.getFileInBase64(organization.logo.id);
    }
  }

  private async addCandidateDemographicsToReport(
    candidate: Candidate,
    candidateAssessmentReport: CandidateAssessmentReportRespDto,
  ): Promise<any> {
    //get the photo of candidate and convert it to base64
    let photoData = '';
    if (candidate.photo != null) {
      photoData = await this.getFileInBase64(candidate.photo.id);
    }
    const data: any = {
      name: candidate.name,
      email: candidate.email,
      contact_number: candidate.contactNumber,
      photo: photoData,
      ...candidateAssessmentReport,
    };

    return data;
  }

  private async getFileInBase64(fileId: number) {
    const file: AssetFile = await this.fileRepository.findOne(fileId);

    const fileName: string = path.join(
      this.fileService.assetsBaseDirectory,
      file.url,
    );
    return fs.readFileSync(fileName, 'base64');
  }

  private async findCandidateOrThrow(candidateId: number): Promise<Candidate> {
    const candidate: Candidate = await this.candidateRepository.findById(
      candidateId,
    );
    if (candidate == null) {
      throw ReportResponseCodes.INVALID_CANDIDATE_ID;
    }
    return candidate;
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

  private async findCandidateAssessmentOrThrow(
    candidate: Candidate,
    assessment: Assessment,
  ): Promise<CandidateAssessment> {
    const candidateAssessment: CandidateAssessment =
      await this.candidateAssessmentRepository.getForCandidateAndAssessment(
        candidate,
        assessment,
      );

    if (candidateAssessment == null) {
      throw ReportResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    return candidateAssessment;
  }
}
