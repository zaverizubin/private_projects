import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssessmentBlockRepository } from './assessment-block.repository';
import { ReorderReqDto } from './dto/request/reorder.req.dto';
import { AssessmentBlockReqDto } from './dto/request/assessment-block.req.dto';
import { AssessmentBlockRespDto } from './dto/response/assessment-block.resp.dto';
import { AssessmentRepository } from '../assessment/assessment.repository';
import { Assessment } from 'src/entities/assessment.entity';
import { AssessmentBlockResponseCodes } from './assessment-block.response.codes';
import { AssessmentBlock } from '../../entities/assessment-block.entity';
import { AssessmentStatus } from 'src/enums/assessment.status';

@Injectable()
export class AssessmentBlockService {
  constructor(
    @InjectRepository(AssessmentBlockRepository)
    private assessmentBlockRepository: AssessmentBlockRepository,
    @InjectRepository(AssessmentRepository)
    private assessmentRepository: AssessmentRepository,
  ) {}

  async getAllByAssessmentId(
    assessmentId: number,
  ): Promise<AssessmentBlockRespDto[]> {
    const assessment: Assessment = await this.assessmentRepository.findOne(
      assessmentId,
    );
    this.throwIfAssessmentNotDefined(assessment);

    const assessmentBlocks: AssessmentBlock[] =
      await this.assessmentBlockRepository.findAllByAssessmentWithQuestions(
        assessment,
      );

    const assessmentBlockRespDtos: AssessmentBlockRespDto[] = [];

    assessmentBlocks.forEach((assessmentBlock: AssessmentBlock) => {
      assessmentBlockRespDtos.push(new AssessmentBlockRespDto(assessmentBlock));
    });
    return assessmentBlockRespDtos;
  }

  async getAssessmentBlockById(
    assessmentBlockId: number,
  ): Promise<AssessmentBlockRespDto> {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithQuestions(
        assessmentBlockId,
      );

    this.throwIfAssessmentBlockNotDefined(assessmentBlock);

    const assessmentBlockRespDto: AssessmentBlockRespDto =
      new AssessmentBlockRespDto(assessmentBlock);
    return assessmentBlockRespDto;
  }

  async createAssessmentBlock(
    assessmentId: number,
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ): Promise<number> {
    const assessment: Assessment = await this.assessmentRepository.findOne(
      assessmentId,
    );
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfAssessmentNotEditable(assessment);

    let sortOrder: number =
      await this.assessmentBlockRepository.getMaxSortOrder(assessmentId);
    sortOrder = sortOrder != null ? sortOrder + 1 : 1;

    let assessmentBlock: AssessmentBlock =
      this.getEntityFromAssessmentBlockReqDto(assessmentBlockReqDto);
    assessmentBlock.assessment = assessment;
    assessmentBlock.sortOrder = sortOrder;

    assessmentBlock = await this.assessmentBlockRepository.save(
      assessmentBlock,
    );
    return assessmentBlock.id;
  }

  async updateAssessmentBlock(
    assessmentBlockId: number,
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ) {
    let assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );

    this.throwIfAssessmentBlockNotDefined(assessmentBlock);
    this.throwIfAssessmentNotEditable(assessmentBlock.assessment);

    assessmentBlock = this.getEntityFromAssessmentBlockReqDto(
      assessmentBlockReqDto,
    );
    assessmentBlock.id = assessmentBlockId;
    await this.assessmentBlockRepository.save(assessmentBlock);
  }

  async reorderAssessmentBlock(
    assessmentId: number,
    reorderReqDto: ReorderReqDto,
  ) {
    const assessment: Assessment = await this.assessmentRepository.findOne(
      assessmentId,
    );
    this.throwIfAssessmentNotDefined(assessment);
    this.throwIfAssessmentNotEditable(assessment);

    if (reorderReqDto.ids.length == 0) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
    }

    const assessmentBlocks: AssessmentBlock[] =
      await this.assessmentBlockRepository.findAllByAssessment(assessment);
    if (assessmentBlocks.length != reorderReqDto.ids.length) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
    }
    assessmentBlocks.forEach((ab) => {
      if (reorderReqDto.ids.indexOf(ab.id) == -1) {
        throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID_LIST;
      }
    });

    reorderReqDto.ids.forEach((id, index) => {
      const assessmentBlock: AssessmentBlock = assessmentBlocks.find(
        (ab) => ab.id == id,
      );
      if (assessmentBlock != null) {
        assessmentBlock.sortOrder = index + 1;
      }
    });

    await this.assessmentBlockRepository.save(assessmentBlocks);
  }

  async deleteAssessmentBlock(assessmentBlockId: number) {
    const assessmentBlock: AssessmentBlock =
      await this.assessmentBlockRepository.findByIdWithAssessment(
        assessmentBlockId,
      );

    this.throwIfAssessmentBlockNotDefined(assessmentBlock);
    this.throwIfAssessmentNotEditable(assessmentBlock.assessment);

    await this.assessmentBlockRepository.remove(assessmentBlock);
    await this.assessmentBlockRepository.updateSortOrder(
      assessmentBlock.sortOrder,
      assessmentBlock.assessment.id,
    );
  }

  private throwIfAssessmentNotDefined(assessment: Assessment) {
    if (assessment == null) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_ID;
    }
  }

  private throwIfAssessmentBlockNotDefined(assessmentBlock: AssessmentBlock) {
    if (assessmentBlock == null) {
      throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
    }
  }

  private throwIfAssessmentNotEditable(assessment: Assessment) {
    if (assessment.status != AssessmentStatus.DRAFT) {
      throw AssessmentBlockResponseCodes.ASSESSMENT_ACTION_DENIED;
    }
  }

  private getEntityFromAssessmentBlockReqDto(
    assessmentBlockReqDto: AssessmentBlockReqDto,
  ): AssessmentBlock {
    const assessmentBlock = new AssessmentBlock();
    assessmentBlock.title = assessmentBlockReqDto.title;
    assessmentBlock.instruction = assessmentBlockReqDto.instruction;
    assessmentBlock.duration = assessmentBlockReqDto.duration;
    assessmentBlock.closingComments = assessmentBlockReqDto.closing_comments;
    return assessmentBlock;
  }
}
