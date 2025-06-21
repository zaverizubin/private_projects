import { QuestionType } from 'src/enums/question.type';
import { QuestionOptionReqDto } from 'src/modules/question/dto/request/options.req.dto';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AnswerOption } from './answer-option.entity';
import { AssessmentBlock } from './assessment-block.entity';
import { BaseModel } from './base-model.entity';

@Entity({ name: 'question' })
export class Question extends BaseModel {
  @Column({ name: 'type', type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ length: 5000 })
  text: string;

  @Column()
  score: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => AssessmentBlock, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_block_id' })
  assessmentBlock: AssessmentBlock;

  @OneToMany(() => AnswerOption, (answerOption) => answerOption.question, {
    cascade: true,
  })
  answerOptions: AnswerOption[];

  @Column({ type: 'json', nullable: true })
  options: QuestionOptionReqDto;

  @Column({ default: 0 })
  suffleOptions: boolean;
}
