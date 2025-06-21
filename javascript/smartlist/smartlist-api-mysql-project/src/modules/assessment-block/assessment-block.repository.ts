import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AssessmentBlock)
export class AssessmentBlockRepository extends Repository<AssessmentBlock> {
  async findById(id: number): Promise<AssessmentBlock> {
    return this.findOne(id);
  }

  async findAllByAssessment(
    assessment: Assessment,
  ): Promise<AssessmentBlock[]> {
    return this.find({
      where: { assessment: assessment },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  async findAllByAssessmentWithQuestions(
    assessment: Assessment,
  ): Promise<AssessmentBlock[]> {
    return this.find({
      where: { assessment: assessment },
      order: {
        sortOrder: 'ASC',
      },
      relations: ['questions'],
    });
  }

  async findByIdWithAssessment(id: number): Promise<AssessmentBlock> {
    return this.findOne(id, {
      relations: ['assessment'],
    });
  }

  async findByIdWithQuestions(id: number): Promise<AssessmentBlock> {
    return this.findOne(id, {
      relations: ['questions'],
    });
  }

  async updateSortOrder(sortOrder: number, assessmentId: number) {
    this.manager.query(
      `UPDATE assessment_block SET sort_order = sort_order - 1 WHERE sort_order > ${sortOrder} and assessment_id=${assessmentId}`,
    );
  }

  async getAssessmentBlockCount(assessmentId: number): Promise<number> {
    const rawData: any = await this.manager.query(
      `SELECT count(id) as blockCount FROM assessment_block WHERE assessment_id=${assessmentId}`,
    );
    return Number(rawData[0].blockCount);
  }

  async getMaxSortOrder(assessmentId: number): Promise<number> {
    const sortOrder: any = await this.manager.query(
      `SELECT max(sort_order) as maxSortOrder FROM assessment_block WHERE assessment_id=${assessmentId}`,
    );
    return sortOrder[0].maxSortOrder;
  }
}
