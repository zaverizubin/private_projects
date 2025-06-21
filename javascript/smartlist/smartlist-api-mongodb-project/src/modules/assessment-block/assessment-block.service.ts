import { Injectable } from '@nestjs/common';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { AssessmentBlockReqDto } from './dto/request/assessment-block.req.dto';
import { AssessmentBlockRespDto } from './dto/response/assessment-block.resp.dto';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { AssessmentBlockDocumentRepository } from './assessment-block.document.repository';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { AssessmentBlockResponseCodes } from './assessment-block.response.codes';
import { QuestionDocumentRepository } from '../question/question.document.repository';
import { QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class AssessmentBlockService {
  constructor(
    private assessmentDocumentRepository: AssessmentDocumentRepository,
    private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
    private questionDocumentRepository: QuestionDocumentRepository,
  ) { }

  async getAllByAssessmentId(
    assessmentId: string,
  ): Promise<AssessmentBlockRespDto[]> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(assessmentId);
    this.throwIfAssessmentNotDefined(assessmentDocument);

    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(
        assessmentDocument,
      );

    const assessmentBlockRespDtos: AssessmentBlockRespDto[] = [];

    await Promise.all(
      assessmentBlockDocuments.map(
        async (assessmentBlockDocument: AssessmentBlockDocument) => {
          const questionDocuments: QuestionDocument[] =
            await this.questionDocumentRepository.findAllForAssessmentBlock(
              assessmentBlockDocument,
            );
          assessmentBlockRespDtos.push(
            new AssessmentBlockRespDto(
              assessmentBlockDocument,
              questionDocuments,
            ),
          );
        },
      ),
    );

    return assessmentBlockRespDtos;
  }

  async getAssessmentBlockById(
    assessmentBlockId: string,
  ): Promise<AssessmentBlockRespDto> {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);

    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);

    const questionDocuments: QuestionDocument[] =
      await this.questionDocumentRepository.findAllForAssessmentBlock(
        assessmentBlockDocument,
      );

    const assessmentBlockRespDto: AssessmentBlockRespDto =
      new AssessmentBlockRespDto(assessmentBlockDocument, questionDocuments);

    return assessmentBlockRespDto;
  }

  async createAssessmentBlock(
    assessmentId: string,
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ): Promise<number> {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(assessmentId);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfAssessmentNotEditable(assessmentDocument);

    this.throwIfShuffleDataInvalid(assessmentBlockReqDto);

    const count: number = await this.assessmentBlockDocumentRepository.getCountForAssessment(
      assessmentDocument,
    );

    let assessmentBlockDocument: AssessmentBlockDocument =
      this.getEntityFromAssessmentBlockReqDto(
        this.assessmentBlockDocumentRepository.getModelInstance(),
        assessmentBlockReqDto,
      );
    assessmentBlockDocument.assessmentDocument = assessmentDocument;
    assessmentBlockDocument.sort_order = count != null ? count + 1 : 1;

    assessmentBlockDocument = await this.assessmentBlockDocumentRepository.save(
      assessmentBlockDocument,
    );
    return assessmentBlockDocument.id;
  }

  async updateAssessmentBlock(
    assessmentBlockId: string,
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ) {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );
    this.throwIfAssessmentNotEditable(assessmentDocument);

    this.throwIfShuffleDataInvalid(assessmentBlockReqDto);

    this.getEntityFromAssessmentBlockReqDto(
      assessmentBlockDocument,
      assessmentBlockReqDto,
    );
    assessmentBlockDocument.isNew = false;
    await this.assessmentBlockDocumentRepository.save(assessmentBlockDocument);
  }

  async reorderAssessmentBlock(
    assessmentId: string,
    reorderReqDto: ReorderReqDto,
  ) {
    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(assessmentId);
    this.throwIfAssessmentNotDefined(assessmentDocument);
    this.throwIfAssessmentNotEditable(assessmentDocument);

    if (reorderReqDto.ids.length == 0) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
    }

    const assessmentBlockDocuments: AssessmentBlockDocument[] =
      await this.assessmentBlockDocumentRepository.findAllForAssessment(
        assessmentDocument,
      );
    if (assessmentBlockDocuments.length != reorderReqDto.ids.length) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
    }
    assessmentBlockDocuments.forEach((ab) => {
      if (reorderReqDto.ids.indexOf(ab.id) == -1) {
        throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
      }
    });

    reorderReqDto.ids.forEach((id, index) => {
      const assessmentBlockDocument: AssessmentBlockDocument =
        assessmentBlockDocuments.find((ab) => ab.id == id);
      if (assessmentBlockDocument != null) {
        assessmentBlockDocument.sort_order = index + 1;
      }
    });

    await this.assessmentBlockDocumentRepository.saveAll(
      assessmentBlockDocuments,
    );
  }

  async deleteAssessmentBlock(assessmentBlockId: string) {
    const assessmentBlockDocument: AssessmentBlockDocument =
      await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);

    const assessmentDocument: AssessmentDocument =
      await this.assessmentDocumentRepository.findById(
        assessmentBlockDocument.assessmentDocument.toString(),
      );

    this.throwIfAssessmentBlockNotDefined(assessmentBlockDocument);
    this.throwIfAssessmentNotEditable(assessmentDocument);

    await this.assessmentBlockDocumentRepository.delete(
      assessmentBlockDocument,
    );
    await this.assessmentBlockDocumentRepository.updateSortOrder(
      assessmentBlockDocument.sort_order,
      assessmentBlockDocument.assessmentDocument,
    );
  }

  private throwIfAssessmentNotDefined(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument == null) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID;
    }
  }

  private throwIfAssessmentBlockNotDefined(
    assessmentBlockDocument: AssessmentBlockDocument,
  ) {
    if (assessmentBlockDocument == null) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
  }

  private throwIfAssessmentNotEditable(assessmentDocument: AssessmentDocument) {
    if (assessmentDocument.status != AssessmentStatus.DRAFT) {
      throw AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private throwIfShuffleDataInvalid(
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ) {
    if (
      assessmentBlockReqDto.shuffle_questions &&
      assessmentBlockReqDto.random_questions == 0
    ) {
      throw AssessmentBlockResponseCodes.INVALID_QUESTION_NUMBER;
    }
  }

  private getEntityFromAssessmentBlockReqDto(
    assessmentBlockDocument: AssessmentBlockDocument,
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ): AssessmentBlockDocument {
    assessmentBlockDocument.title = assessmentBlockReqDto.title;
    assessmentBlockDocument.instruction = assessmentBlockReqDto.instruction;
    assessmentBlockDocument.duration = assessmentBlockReqDto.duration;
    assessmentBlockDocument.question_point =
      assessmentBlockReqDto.question_point;
    assessmentBlockDocument.closing_comments =
      assessmentBlockReqDto.closing_comments;
    assessmentBlockDocument.random_questions =
      assessmentBlockReqDto.random_questions;
    assessmentBlockDocument.shuffle_questions =
      assessmentBlockReqDto.shuffle_questions;
    return assessmentBlockDocument;
  }
}
