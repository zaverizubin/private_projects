import { AssessmentBlock } from 'src/entities/assessment-block.entity';
import { Assessment } from 'src/entities/assessment.entity';
import { Question } from 'src/entities/question.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
  async findById(id: number): Promise<Question> {
    return this.findOne(id);
  }

  async getMaxSortOrder(assessmentBlockId: number): Promise<number> {
    const rawData: any = await this.manager.query(
      `SELECT max(sort_order) as maxSortOrder FROM question WHERE assessment_block_id=${assessmentBlockId}`,
    );
    return Number(rawData[0].maxSortOrder);
  }

  async findAllByAssessment(assessment: Assessment): Promise<Question[]> {
    return this.createQueryBuilder('question')
      .innerJoinAndSelect('question.assessmentBlock', 'assessmentBlock')
      .innerJoinAndSelect('assessmentBlock.assessment', 'assessment')
      .where('assessment.id = :id', { id: assessment.id })
      .getMany();
  }

  async findAllByAssessmentBlockWithAnswers(
    assessmentBlock: AssessmentBlock,
  ): Promise<Question[]> {
    return this.find({
      where: { assessmentBlock: assessmentBlock },
      order: {
        sortOrder: 'ASC',
      },
      relations: ['answerOptions'],
    });
  }

  async findByIdWithRelations(id: number): Promise<Question> {
    return this.findOne(id, {
      relations: [
        'assessmentBlock',
        'assessmentBlock.assessment',
        'answerOptions',
      ],
    });
  }

  async findByIdWithAnswerOptions(id: number): Promise<Question> {
    return this.findOne(id, {
      relations: ['answerOptions'],
    });
  }

  async findByIdWithAssessmentBlock(id: number): Promise<Question> {
    return this.findOne(id, {
      relations: ['assessmentBlock'],
    });
  }

  async findAllByAssessmentBlock(
    assessmentBlock: AssessmentBlock,
  ): Promise<Question[]> {
    return this.find({
      where: { assessmentBlock: assessmentBlock },
      order: {
        sortOrder: 'ASC',
      },
    });
  }

  async updateSortOrder(sortOrder: number, assessmentBlockId: number) {
    this.manager.query(
      `UPDATE question SET sort_order = sort_order - 1 WHERE sort_order > ${sortOrder} and assessment_block_id=${assessmentBlockId}`,
    );
  }

  async getCountForAssessment(assessmentId: number): Promise<number> {
    const rawData: any = await this.manager.query(
      `SELECT COUNT(q.id) as count FROM question q
      INNER JOIN assessment_block ab ON q.assessment_block_id = ab.id 
      WHERE ab.assessment_id  = ${assessmentId}`,
    );
    return Number(rawData[0].count);
  }
}
