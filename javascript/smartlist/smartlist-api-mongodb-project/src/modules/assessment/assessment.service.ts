import { Injectable } from '@nestjs/common';
import { AssessmentResponseCodes } from './assessment.response.codes';
import { AssessmentReqDto } from './dto/request/assessment.req.dto';
import { AssessmentRespDto } from './dto/response/assessment.resp.dto';
import { AssessmentStatus } from '../../enums/assessment.status';
import { getFormattedDate } from 'src/utils/date.utils';
import { CryptoService } from 'src/providers/crypto.service';
import { FileService } from '../file/file.service';
import { AssessmentStatusCountRespDto } from './dto/response/assessment-status-count.res.dto';
import { DuplicateAssessmentForOrganizationsReqDto } from './dto/request/duplicate-assessment-for-organizations.req.dto';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { AssetFileDocumentRepository } from '../file/file.document.repository';
import { AssessmentDocumentRepository } from './assessment.document.repository';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { AssetFileDocument } from 'src/schemas/asset-file.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';

@Injectable()
export class AssessmentService {
  constructor(
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
    private organizationDocumentRepository: OrganizationDocumentRepository,
    private assetFileDocumentRepository: AssetFileDocumentRepository,
    private fileService: FileService,
    private cryptoService: CryptoService,
  ) { }

  async getAllForOrganization(
    organizationId: string,
    status: AssessmentStatus,
  ): Promise<AssessmentRespDto[]> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organizationDocument);
    this.throwIfAssessmentStatusInvalid(status);

    const assessmentDocuments: AssessmentDocument[] =
      await this.assessmentDocumentRepository.findByOrganizationAndStatus(
        organizationDocument,
        status,
      );
    const assessmentsResponse: AssessmentRespDto[] = [];
    assessmentDocuments.forEach((assessmentDocument) => {
      assessmentsResponse.push(new AssessmentRespDto(assessmentDocument));
    });
    return assessmentsResponse;
  }

  async getAssessmentById(id: string): Promise<AssessmentRespDto> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(id);

    this.throwIfAssessmentNotDefined(assessmentDocument);

    const assessmentRespDto = new AssessmentRespDto(assessmentDocument);
    return assessmentRespDto;
  }

  async getAssessmentByToken(token: string): Promise<AssessmentRespDto> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findByToken(token);

    if (assessmentDocument == null) {
      throw AssessmentResponseCodes.INVALID_ASSESSMENT_TOKEN;
    }

    const assessmentRespDto = new AssessmentRespDto(assessmentDocument);
    return assessmentRespDto;
  }

  async createAssessment(assessmentReqDto: AssessmentReqDto): Promise<string> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(
        assessmentReqDto.organization_id,
      );
    this.throwIfOrganizationNotDefined(organizationDocument);

    let headerImage: AssetFileDocument = null;
    if (assessmentReqDto.header_image_id != null) {
      headerImage = await this.assetFileDocumentRepository.findById(
        assessmentReqDto.header_image_id,
      );
      this.throwIfHeaderFileNotDefined(headerImage);
    }

    let assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findByNameAndOrganization(
        assessmentReqDto.name,
        organizationDocument,
      );
    if (assessmentDocument != null) {
      throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
    }

    const token: string = this.cryptoService.generateToken();

    assessmentDocument = this.getEntityFromAssessmentReqDto(assessmentReqDto);
    assessmentDocument.header_image = headerImage;
    assessmentDocument.organizationDocument = organizationDocument;
    assessmentDocument.status = AssessmentStatus.DRAFT;
    assessmentDocument.token = token;
    assessmentDocument = await this.assessmentDocumentRepository.save(
      assessmentDocument,
    );

    return assessmentDocument.id;
  }

  async updateAssessment(id: string, assessmentDto: AssessmentReqDto) {
    let assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(id);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfPublished(assessmentDocument);

    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(
        assessmentDto.organization_id,
      );
    this.throwIfOrganizationNotDefined(organizationDocument);

    let headerImage: AssetFileDocument = null;
    if (assessmentDto.header_image_id != null) {
      headerImage = await this.assetFileDocumentRepository.findById(
        assessmentDto.header_image_id,
      );
      this.throwIfHeaderFileNotDefined(headerImage);
    }

    assessmentDocument =
      await this.assessmentDocumentRepository.findByNameAndOrganization(
        assessmentDto.name,
        organizationDocument,
      );
    if (assessmentDocument != null && assessmentDocument.id != id) {
      throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
    }

    assessmentDocument = this.getEntityFromAssessmentReqDto(assessmentDto);

    assessmentDocument._id = id;
    assessmentDocument.header_image = headerImage;
    assessmentDocument.organizationDocument = organizationDocument;
    assessmentDocument.status = AssessmentStatus.DRAFT;
    assessmentDocument.isNew = false;
    await this.assessmentDocumentRepository.save(assessmentDocument);
  }

  async publishAssessment(id: string) {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(id);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfPublished(assessmentDocument);

    await this.throwIfAssessmentBlockCountInvalid(assessmentDocument);
    await this.throwIfQuestionCountInvalid(assessmentDocument);

    assessmentDocument.status = AssessmentStatus.ACTIVE;
    assessmentDocument.activated_on = getFormattedDate();

    await this.assessmentDocumentRepository.save(assessmentDocument);
  }

  async deleteAssessment(id: string) {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(id);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfPublished(assessmentDocument);
    this.assessmentDocumentRepository.delete(assessmentDocument);
  }

  async setAssessmentActive(id: string, active: boolean) {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(id);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfDraft(assessmentDocument);

    if (active) {
      assessmentDocument.status = AssessmentStatus.ACTIVE;
      assessmentDocument.activated_on = getFormattedDate();
    } else {
      assessmentDocument.status = AssessmentStatus.ARCHIVED;
      assessmentDocument.activated_on = getFormattedDate();
    }
    this.assessmentDocumentRepository.save(assessmentDocument);
  }

  async duplicateAssessment(
    organizationDocument: OrganizationDocument,
    assessmentId: string,
  ): Promise<string> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(assessmentId);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.buildDeepCopyOfAssessment(assessmentDocument, organizationDocument);

    return assessmentDocument.id;
  }

  async searchByStatusAndNameForOrganization(
    organizationId: string,
    name: string,
    status: AssessmentStatus,
  ): Promise<AssessmentRespDto> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organizationDocument);
    this.throwIfAssessmentStatusInvalid(status);

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findByStatusAndNameForOrganization(
        organizationDocument,
        status,
        name,
      );
    return assessmentDocument != null ? new AssessmentRespDto(assessmentDocument) : null;
  }

  async getAssessmentStatusCountForOrganization(
    organizationId: string,
  ): Promise<AssessmentStatusCountRespDto> {
    const organizationDocument: OrganizationDocument =
      await this.organizationDocumentRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organizationDocument);

    const assessmentDocuments: AssessmentDocument[] =
      await this.assessmentDocumentRepository.findByOrganization(
        organizationDocument,
      );
    let activeCount = 0;
    let archivedCount = 0;
    let draftsCount = 0;
    assessmentDocuments.forEach((assessmentDocument) => {
      switch (assessmentDocument.status) {
        case AssessmentStatus.ACTIVE:
          activeCount++;
          break;
        case AssessmentStatus.ARCHIVED:
          archivedCount++;
          break;
        case AssessmentStatus.DRAFT:
          draftsCount++;
      }
    });

    const assessmentStatusCountRespDto = new AssessmentStatusCountRespDto(
      activeCount,
      archivedCount,
      draftsCount,
    );

    return assessmentStatusCountRespDto;
  }

  async duplicateAssessmentForOrganizations(
    duplicateAssessmentForOrganizationsReqDto: DuplicateAssessmentForOrganizationsReqDto,
  ) {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        duplicateAssessmentForOrganizationsReqDto.assessment_id,
      );
    this.throwIfAssessmentNotDefined(assessmentDocument);

    const organizationDocuments: OrganizationDocument[] = [];

    for (
      let i = 0;
      i < duplicateAssessmentForOrganizationsReqDto.organization_ids.length;
      i++
    ) {
      const id: string =
        duplicateAssessmentForOrganizationsReqDto.organization_ids[i];
      const organizationDocument: OrganizationDocument =
        await this.organizationDocumentRepository.findById(id);

      this.throwIfOrganizationNotDefined(organizationDocument);

      organizationDocuments.push(organizationDocument);
    }

    organizationDocuments.forEach((organizationDocument) => {
      this.duplicateAssessment(organizationDocument, assessmentDocument.id);
    });
  }

  private throwIfAssessmentStatusInvalid(status: AssessmentStatus) {
    switch (status) {
      case AssessmentStatus.DRAFT:
      case AssessmentStatus.ACTIVE:
      case AssessmentStatus.ARCHIVED:
        break;
      default:
        throw AssessmentResponseCodes.INVALID_ASSESSMENT_STATUS;
    }
  }

  private async throwIfAssessmentBlockCountInvalid(
    assessmentDocument: AssessmentDocument,
  ) {
    const count: number =
      await this.assessmentBlockDocumentRepository.getCountForAssessment(
        assessmentDocument,
      );
    if (count == 0) {
      throw AssessmentResponseCodes.INVALID_ASSESSMENT_BLOCK_COUNT;
    }
  }

  private async throwIfQuestionCountInvalid(
    assessmentDocument: AssessmentDocument,
  ) {
    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(
        assessmentDocument,
      );
    for (let i = 0; i < assessmentBlockDocuments.length; i++) {
      const count: number =
        await this.questionDocumentRepository.getCountForAssessmentBlock(
          assessmentBlockDocuments[i],
        );
      if (count == 0) {
        throw AssessmentResponseCodes.INVALID_QUESTION_COUNT;
      }
    }
  }

  private throwIfHeaderFileNotDefined(assetFileDocument: AssetFileDocument) {
    if (assetFileDocument == null) {
      throw AssessmentResponseCodes.INVALID_HEADER_FILE_ID;
    }
  }

  private throwIfAssessmentNotDefined(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument == null) {
      throw AssessmentResponseCodes.INVALID_ASSESSMENT_ID;
    }
  }

  private throwIfDraft(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument.status == AssessmentStatus.DRAFT) {
      throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfPublished(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument.status != AssessmentStatus.DRAFT) {
      throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfOrganizationNotDefined(
    organizationDocument: OrganizationDocument,
  ) {
    if (organizationDocument == null) {
      throw AssessmentResponseCodes.INVALID_ORGANIZATION_ID;
    }
  }

  private getEntityFromAssessmentReqDto(
    assessmentReqDto: AssessmentReqDto,
  ): AssessmentDocument {
    const assessmentDocument: AssessmentDocument =
      this.assessmentDocumentRepository.getModelInstance();

    assessmentDocument.name = assessmentReqDto.name;
    assessmentDocument.position = assessmentReqDto.position;
    assessmentDocument.department = assessmentReqDto.department;
    assessmentDocument.introduction = assessmentReqDto.introduction;
    assessmentDocument.video_link_url = assessmentReqDto.video_link_url;
    return assessmentDocument;
  }

  private async buildDeepCopyOfAssessment(
    assessmentDocument: AssessmentDocument,
    organizationDocument: OrganizationDocument,
  ) {

    delete assessmentDocument.id;
    assessmentDocument.name = assessmentDocument.name + ' copy';
    if (organizationDocument) {
      assessmentDocument.organizationDocument = organizationDocument;
    }
    const token: string = this.cryptoService.generateToken();
    assessmentDocument.token = token;
    assessmentDocument.status = AssessmentStatus.DRAFT;
    assessmentDocument.activated_on = null;
    if (assessmentDocument.header_image != null) {
      assessmentDocument.header_image = await this.fileService.copyAndSaveFile(
        assessmentDocument.header_image,
      );
    }
    await this.assessmentDocumentRepository.save(assessmentDocument);

    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(
        assessmentDocument,
      );

    const oldNewMap: Map<AssessmentBlockDocument, AssessmentBlockDocument> =
      new Map<AssessmentBlockDocument, AssessmentBlockDocument>();


    /* assessmentBlockDocuments.map(async (assessmentBlockDocument) => {
       const questionDocuments: QuestionDocument[] = this.questionDocumentRepository.findAllForAssessmentBlock(assessmentBlockDocument);
 
       delete assessmentBlockDocument.id;
       assessmentBlockDocument.assessmentDocument = assessmentDocument;
       await assessmentBlockDocument.save();
       questionDocuments.map(async (questionDocument) => {
         
       });
     }),*/
  }
}
