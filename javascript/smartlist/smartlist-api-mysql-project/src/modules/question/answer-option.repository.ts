import { AnswerOption } from 'src/entities/answer-option.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AnswerOption)
export class AnswerOptionRepository extends Repository<AnswerOption> {
  async findByIdWithQuestion(id: number): Promise<AnswerOption> {
    return await this.findOne(id, {
      relations: ['question'],
    });
  }
}
