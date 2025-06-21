import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from 'src/entities/assessment.entity';
import { AssetFile } from 'src/entities/asset-file.entity';
import { Organization } from 'src/entities/organization.entity';
import { FileRepository } from '../file/file.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { AssessmentRepository } from './assessment.repository';
import { AssessmentResponseCodes } from './assessment.response.codes';
import { AssessmentReqDto } from './dto/request/assessment.req.dto';
import { AssessmentRespDto } from './dto/response/assessment.resp.dto';
import { AssessmentStatus } from '../../enums/assessment.status';
import { getFormattedDate } from 'src/utils/date.utils';
import { CryptoService } from 'src/providers/crypto.service';
import { QuestionRepository } from '../question/question.repository';
import { Question } from 'src/entities/question.entity';
import { FileService } from '../file/file.service';
import { AssessmentStatusCountRespDto } from './dto/response/assessment-status-count.res.dto';
import { DuplicateAssessmentForOrganizationsReqDto } from './dto/request/duplicate-assessment-for-organizations.req.dto';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,
    private fileService: FileService,
    private cryptoService: CryptoService,
  ) {}

  async getAssessmentById(id: number): Promise<AssessmentRespDto> {
    const assessment: Assessment =
      await this.assessmentRepository.findByIdWithRelations(id);

    this.throwIfAssessmentNotDefined(assessment);

    const assessmentRespDto = new AssessmentRespDto(assessment);
    return assessmentRespDto;
  }

  async getAssessmentByToken(token: string): Promise<AssessmentRespDto> {
    const assessment: Assessment =
      await this.assessmentRepository.findByTokenWithRelations(token);

    this.throwIfAssessmentNotDefined(assessment);

    const assessmentRespDto = new AssessmentRespDto(assessment);
    return assessmentRespDto;
  }

  async createAssessment(assessmentReqDto: AssessmentReqDto): Promise<number> {
    const organization: Organization =
      await this.organizationRepository.findById(
        assessmentReqDto.organization_id,
      );
    this.throwIfOrganizationNotDefined(organization);

    let headerFile: AssetFile = null;
    if (assessmentReqDto.header_image_id != null) {
      headerFile = await this.fileRepository.findOne(
        assessmentReqDto.header_image_id,
      );
      this.throwIfHeaderFileNotDefined(headerFile);
    }

    let assessment: Assessment =
      await this.assessmentRepository.findByNameAndOrganization(
        assessmentReqDto.name,
        organization,
      );
    if (assessment != null) {
      throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
    }

    const token: string = this.cryptoService.generateToken();

    assessment = this.getEntityFromAssessmentReqDto(assessmentReqDto);
    assessment.headerImage = headerFile;
    assessment.organization = organization;
    assessment.status = AssessmentStatus.DRAFT;
    assessment.token = token;
    assessment = await this.assessmentRepository.save(assessment);

    return assessment.id;
  }

  async updateAssessment(id: number, assessmentDto: AssessmentReqDto) {
    let assessment: Assessment = await this.assessmentRepository.findOne(id);
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfPublished(assessment);

    const organization: Organization =
      await this.organizationRepository.findById(assessmentDto.organization_id);
    this.throwIfOrganizationNotDefined(organization);

    let headerFile: AssetFile = null;
    if (assessmentDto.header_image_id != null) {
      headerFile = await this.fileRepository.findOne(
        assessmentDto.header_image_id,
      );
      this.throwIfHeaderFileNotDefined(headerFile);
    }

    assessment = await this.assessmentRepository.findByNameAndOrganization(
      assessmentDto.name,
      organization,
    );
    if (assessment != null && assessment.id != id) {
      throw AssessmentResponseCodes.ASSESSMENT_NAME_EXISTS;
    }

    assessment = this.getEntityFromAssessmentReqDto(assessmentDto);

    assessment.id = id;
    assessment.headerImage = headerFile;
    assessment.organization = organization;
    assessment.status = AssessmentStatus.DRAFT;
    await this.assessmentRepository.save(assessment);
  }

  async publishAssessment(id: number) {
    const assessment: Assessment =
      await this.assessmentRepository.findByIdWithAssessmentBlocks(id);
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfPublished(assessment);
    this.throwIfAssessmentBlockCountInvalid(assessment);
    await this.throwIfQuestionCountInvalid(assessment);

    await this.assessmentRepository.update(id, {
      status: AssessmentStatus.ACTIVE,
      activatedOn: getFormattedDate(),
    });
  }

  async deleteAssessment(id: number) {
    const assessment: Assessment = await this.assessmentRepository.findOne(id);
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfPublished(assessment);
    this.assessmentRepository.remove(assessment);
  }

  async setAssessmentActive(id: number, active: boolean) {
    const assessment: Assessment = await this.assessmentRepository.findOne(id);
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfDraft(assessment);

    if (active) {
      await this.assessmentRepository.update(id, {
        status: AssessmentStatus.ACTIVE,
        activatedOn: getFormattedDate(),
      });
    } else {
      await this.assessmentRepository.update(id, {
        status: AssessmentStatus.ARCHIVED,
        deactivatedOn: getFormattedDate(),
      });
    }
  }

  async duplicateAssessment(
    organization: Organization,
    assessmentId: number,
  ): Promise<number> {
    const assessment: Assessment =
      await this.assessmentRepository.findByIdWithAssessmentBlockRelations(
        assessmentId,
      );
    this.throwIfAssessmentNotDefined(assessment);
    this.buildDeepCopyOfAssessment(assessment);

    const token: string = this.cryptoService.generateToken();
    if (organization) {
      assessment.organization = organization;
    }
    assessment.token = token;
    assessment.status = AssessmentStatus.DRAFT;
    assessment.activatedOn = null;
    assessment.createdAt = new Date();
    assessment.modifiedAt = new Date();
    if (assessment.headerImage != null) {
      assessment.headerImage = await this.fileService.copyAndSaveFile(
        assessment.headerImage,
      );
    }
    await this.assessmentRepository.save(assessment);

    return assessment.id;
  }

  async duplicateAssessmentForOrganizations(
    duplicateAssessmentForOrganizationsReqDto: DuplicateAssessmentForOrganizationsReqDto,
  ) {
    const assessment: Assessment = await this.assessmentRepository.findById(
      duplicateAssessmentForOrganizationsReqDto.assessment_id,
    );
    this.throwIfAssessmentNotDefined(assessment);

    const organizations: Organization[] = [];

    for (
      let i = 0;
      i < duplicateAssessmentForOrganizationsReqDto.organization_ids.length;
      i++
    ) {
      const id: number =
        duplicateAssessmentForOrganizationsReqDto.organization_ids[i];
      const organization: Organization =
        await this.organizationRepository.findById(id);

      this.throwIfOrganizationNotDefined(organization);

      organizations.push(organization);
    }

    organizations.forEach((organization) => {
      this.duplicateAssessment(organization, assessment.id);
    });
  }

  async getAllForOrganization(
    organizationId: number,
    status: AssessmentStatus,
  ): Promise<AssessmentRespDto[]> {
    const organization: Organization =
      await this.organizationRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organization);
    this.throwIfAssessmentStatusInvalid(status);

    const assessments =
      await this.assessmentRepository.findByOrganizationAndStatusWithRelations(
        organization,
        status,
      );
    const assessmentsResponse: AssessmentRespDto[] = [];
    assessments.forEach((assessment) => {
      assessmentsResponse.push(new AssessmentRespDto(assessment));
    });
    return assessmentsResponse;
  }

  async searchByStatusAndNameForOrganization(
    organizationId: number,
    name: string,
    status: AssessmentStatus,
  ): Promise<AssessmentRespDto[]> {
    const organization: Organization =
      await this.organizationRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organization);
    this.throwIfAssessmentStatusInvalid(status);

    const assessments =
      await this.assessmentRepository.findByStatusAndNameForOrganizationWithRelations(
        organization,
        status,
        name,
      );
    const assessmentsResponse: AssessmentRespDto[] = [];
    assessments.forEach((assessment) => {
      assessmentsResponse.push(new AssessmentRespDto(assessment));
    });
    return assessmentsResponse;
  }

  async getAssessmentStatusCount(
    organizationId: number,
  ): Promise<AssessmentStatusCountRespDto> {
    const organization: Organization =
      await this.organizationRepository.findById(organizationId);
    this.throwIfOrganizationNotDefined(organization);

    const assessment: Assessment[] =
      await this.assessmentRepository.findByOrganization(organization);
    let activeCount = 0;
    let archivedCount = 0;
    let draftsCount = 0;
    assessment.forEach((assessment) => {
      switch (assessment.status) {
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

  private throwIfAssessmentBlockCountInvalid(assessment: Assessment) {
    if (assessment.assessmentBlocks.length == 0) {
      throw AssessmentResponseCodes.INVALID_ASSESSMENT_BLOCK_COUNT;
    }
  }

  private async throwIfQuestionCountInvalid(assessment: Assessment) {
    for (let i = 0; i < assessment.assessmentBlocks.length; i++) {
      const questions: Question[] =
        await this.questionRepository.findAllByAssessmentBlock(
          assessment.assessmentBlocks[i],
        );
      if (questions.length == 0) {
        throw AssessmentResponseCodes.INVALID_QUESTION_COUNT;
      }
    }
  }

  private throwIfHeaderFileNotDefined(headerFile: AssetFile) {
    if (headerFile == null) {
      throw AssessmentResponseCodes.INVALID_HEADER_FILE_ID;
    }
  }

  private throwIfAssessmentNotDefined(assessment: Assessment) {
    if (assessment == null) {
      throw AssessmentResponseCodes.INVALID_ASSESSMENT_ID;
    }
  }

  private throwIfDraft(assessment: Assessment) {
    if (assessment.status == AssessmentStatus.DRAFT) {
      throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfPublished(assessment: Assessment) {
    if (assessment.status != AssessmentStatus.DRAFT) {
      throw AssessmentResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfOrganizationNotDefined(organization: Organization) {
    if (organization == null) {
      throw AssessmentResponseCodes.INVALID_ORGANIZATION_ID;
    }
  }

  private getEntityFromAssessmentReqDto(
    assessmentReqDto: AssessmentReqDto,
  ): Assessment {
    const assessment = new Assessment();
    assessment.name = assessmentReqDto.name;
    assessment.position = assessmentReqDto.position;
    assessment.department = assessmentReqDto.department;
    assessment.introduction = assessmentReqDto.introduction;
    assessment.videoLinkURL = assessmentReqDto.video_link_url;
    return assessment;
  }

  private buildDeepCopyOfAssessment(assessment: Assessment) {
    assessment.id = null;
    assessment.name = assessment.name + ' copy';
    assessment.assessmentBlocks.forEach((assessmentBlock) => {
      delete assessmentBlock.id;
      assessmentBlock.questions.forEach((question) => {
        delete question.id;
        question.answerOptions.forEach((answerOption) => {
          delete answerOption.id;
        });
      });
    });
  }
}
