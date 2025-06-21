import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { BaseModel } from './base-model.entity';
import { IsBoolean } from 'class-validator';

@Entity({ name: 'answer_option' })
export class AnswerOption extends BaseModel {
  @Column()
  @IsBoolean()
  correct: boolean;

  @Column({ length: 1000 })
  text: string;

  @ManyToOne(() => Question, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ nullable: true })
  score: number;
}
