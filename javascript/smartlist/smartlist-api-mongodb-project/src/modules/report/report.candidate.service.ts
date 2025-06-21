import { Injectable } from '@nestjs/common';
import { ReportResponseCodes } from './report.response.codes';
import { CandidateAssessmentReportRespDto } from './dto/response/candidate-assessment-report.resp.dto';
import { EmailService } from 'src/providers/email.service';
import { FileService } from '../file/file.service';
import { generatePdf } from 'src/utils/file.utils';
import {
  getEpochStartDate,
  getDateAtEOD,
  getDateAtSOD,
  getDateInISOFormattedDate,
} from 'src/utils/date.utils';
import { convertToUpperCamelCase, REGEX } from 'src/utils/app.utils';
import * as fs from 'fs';
import * as path from 'path';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { QuestionCommentDocumentRepository } from '../grading/question-comment.document.repository';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { ReportDocumentRepository } from './report.document.repository';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { QuestionCommentDocument } from 'src/schemas/question-comment.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { QuestionDocumentRepository } from '../question/question.document.repository';

@Injectable()
export class ReportCandidateService {
  constructor(
    private candidateDocumentRepository: CandidateDocumentRepository,
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
    private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
    private assetFileDocumentRepository: AssetFileDocumentRepository,
    private questionCommentDocumentRepository: QuestionCommentDocumentRepository,
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private reportDocumentRepository: ReportDocumentRepository,
    private emailService: EmailService,
    private fileService: FileService,
  ) {

  }

  async getCandidateAssessmentReport(
    candidateId: string,
    assessmentId: string,
  ): Promise<CandidateAssessmentReportRespDto> {
    return await this.generateCandidateReportData(candidateId, assessmentId);
  }

  async getCandidateAssessmentReportAsPDF(
    candidateId: string,
    assessmentId: string,
  ): Promise<Buffer> {
    const candidateDocument: CandidateDocument = await this.findCandidateOrThrow(candidateId);
    const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
    const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);
    const questionDocuments: QuestionDocument[] = await this.questionDocumentRepository.findAllForAssessmentBlocks(assessmentBlockDocuments);

    const candidateReportRespDto: CandidateAssessmentReportRespDto =
      await this.generateCandidateReportData(candidateId, assessmentId);

    let reportData: any = await this.addCandidateDemographicsToReport(
      candidateDocument,
      candidateReportRespDto,
    );

    const logo = await this.getOrganizationPhoto(reportData, assessmentId);

    const questionCommentDocuments: QuestionCommentDocument[] =
      await this.questionCommentDocumentRepository.findByCandidateAndQuestions(
        candidateDocument,
        questionDocuments,
      );

    for (let i = 0; i < questionCommentDocuments.length; i++) {
      questionCommentDocuments[i].questionDocument[0].text = questionCommentDocuments[i].questionDocument[0].text.replace(REGEX.QUESTION, '');
    }
    reportData = {
      ...reportData,
      assessment_decision: convertToUpperCamelCase(
        reportData.assessment_decision,
      ),
      logo: logo,
      start_date: getDateInISOFormattedDate(reportData.start_date),
      questionCommentDocuments,
    };
    //call generatePdf method with the data
    const filePath =
      __dirname + '/../../assets/report_templates/candidate_assessment.hbs';

    return await generatePdf(reportData, filePath);
  }

  async sendCandidateAssessmentReportMail(
    candidateId: string,
    assessmentId: string,
  ) {
    const candidateDocument: CandidateDocument = await this.findCandidateOrThrow(candidateId);

    const candidateReportRespDto: CandidateAssessmentReportRespDto =
      await this.generateCandidateReportData(candidateId, assessmentId);

    const reportData: any = await this.addCandidateDemographicsToReport(
      candidateDocument,
      candidateReportRespDto,
    );

    return await this.emailService.sendReportMail(
      reportData.email.toString(),
      reportData,
    );
  }

  async generateCandidateReportData(
    candidateId: string,
    assessmentId: string,
  ): Promise<CandidateAssessmentReportRespDto> {
    const candidateDocument: CandidateDocument = await this.findCandidateOrThrow(candidateId);
    const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);

    const candidateAssessmentDocument: CandidateAssessmentDocument = await this.findCandidateAssessmentOrThrow(
      candidateDocument,
      assessmentDocument,
    );

    const assessmentBlockSumOfScores: any[] = [];
    const candidateAssessmentBlockScores: any[] = [];
    const maxPossibleAssessmentBlockScores: any[] = [];

    //Get all Score data
    let rawData =
      await this.reportDocumentRepository.getAssessmentBlockSumOfScoresForAssessment(
        assessmentId,
        getDateAtSOD(getEpochStartDate()),
        getDateAtEOD(new Date()),
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
      await this.reportDocumentRepository.getCandidateAssessmentBlockScoresForAssessment(
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

    rawData = await this.getMaxBlockAvgScore(assessmentDocument);

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
      await this.candidateAssessmentDocumentRepository.getCountOfCompletedAssessments(
        assessmentDocument,
      );

    //Calculate Assessment block average scores as a percentage
    const assessmentBlockScores: any = [];
    maxPossibleAssessmentBlockScores.forEach((mpabs) => {
      const abss: any = assessmentBlockSumOfScores.find((obj) => {
        return obj.assessmentBlockId.toString() == mpabs.assessmentBlockId.toString();
      });
      const cabs: any = candidateAssessmentBlockScores.find((obj) => {
        return obj.assessmentBlockId.toString() == mpabs.assessmentBlockId.toString();
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

    const candidateOverallScore = Math.round(
      (100 * overallScore) / overallMaxScore,
    );

    //compose report data
    const candidateAssessmentReportRespDto: CandidateAssessmentReportRespDto =
      new CandidateAssessmentReportRespDto();
    candidateAssessmentReportRespDto.start_date = candidateAssessmentDocument.start_date;
    candidateAssessmentReportRespDto.end_date = candidateAssessmentDocument.end_date;
    candidateAssessmentReportRespDto.assessment_decision =
      candidateAssessmentDocument.assessment_decision;
    candidateAssessmentReportRespDto.group_average_score = groupAverageScore;
    candidateAssessmentReportRespDto.candidate_average_score =
      candidateAverageScore;
    candidateAssessmentReportRespDto.assessment_block_scores =
      assessmentBlockScores;
    candidateAssessmentReportRespDto.overall_score = candidateOverallScore;
    candidateAssessmentReportRespDto.assessment_name = assessmentDocument.name;

    return candidateAssessmentReportRespDto;
  }

  private async getOrganizationPhoto(reportData: any, assessmentId: string): Promise<string> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(assessmentId);
    const organization =
      await this.organizationDocumentRepository.findById(
        assessmentDocument.organizationDocument._id.toString(),
      );
    if (organization.logo) {
      return await this.getFileInBase64(organization.logo._id.toString());
    }
  }

  public async getMaxBlockAvgScore(assessmentDocument: AssessmentDocument): Promise<any> {
    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);

    const blockIds = assessmentBlockDocuments
      .filter((item) => item.shuffle_questions)
      .map((item) => item.id);
    const tempArray = {};
    if (blockIds.length > 0) {
      const countDatas = await this.reportDocumentRepository.getQuestionCount(blockIds);
      for (const respCount of countDatas) {
        tempArray[respCount.id] = respCount.count;
      }
    }
    const rawData = [];
    for (const assessmentBlockDocument of assessmentBlockDocuments) {
      if (assessmentBlockDocument.shuffle_questions) {
        const data = {
          assessmentBlockId: assessmentBlockDocument.id,
          title: assessmentBlockDocument.title,
          score:
            Math.min(
              assessmentBlockDocument.random_questions,
              tempArray[assessmentBlockDocument.id],
            ) * assessmentBlockDocument.question_point,
        };
        rawData.push(data);
      } else {
        const blockRawData = await this.reportDocumentRepository.getBlockScore(
          assessmentBlockDocument.id,
        );
        const blockRaw = blockRawData[0];
        rawData.push(blockRaw);
      }
    }

    return rawData;
  }

  private async addCandidateDemographicsToReport(
    candidateDocument: CandidateDocument,
    candidateAssessmentReport: CandidateAssessmentReportRespDto,
  ): Promise<any> {
    //get the photo of candidate and convert it to base64
    let photoData = '';
    if (candidateDocument.photo != null) {
      photoData = await this.getFileInBase64(candidateDocument.photo._id.toString());
    }
    const data: any = {
      name: candidateDocument.name,
      email: candidateDocument.email,
      contact_number: candidateDocument.contact_number,
      photo: photoData,
      ...candidateAssessmentReport,
    };

    return data;
  }

  private async getFileInBase64(fileId: string): Promise<any> {
    const file: AssetFileDocument = await this.assetFileDocumentRepository.findById(fileId);

    const fileName: string = path.join(
      this.fileService.assetsBaseDirectory,
      file.url,
    );
    return fs.readFileSync(fileName, 'base64');
  }

  private async findCandidateOrThrow(candidateId: string): Promise<CandidateDocument> {
    const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(
      candidateId,
    );
    if (candidateDocument == null) {
      throw ReportResponseCodes.INVALID_CANDIDATE_ID;
    }
    return candidateDocument;
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

  private async findCandidateAssessmentOrThrow(
    candidateDocument: CandidateDocument,
    assessmentDocument: AssessmentDocument,
  ): Promise<CandidateAssessmentDocument> {
    const candidateAssessmentDocument: CandidateAssessmentDocument =
      await this.candidateAssessmentDocumentRepository.findByCandidateAndAssessment(
        candidateDocument,
        assessmentDocument,
      );

    if (candidateAssessmentDocument == null) {
      throw ReportResponseCodes.CANDIDATE_ASSESSMENT_DOES_NOT_EXISTS;
    }
    return candidateAssessmentDocument;
  }
}
