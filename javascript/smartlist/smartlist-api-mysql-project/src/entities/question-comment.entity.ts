import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { Candidate } from './candidate.entity';
import { Question } from './question.entity';

@Entity({ name: 'question_comment' })
export class QuestionComment extends BaseModel {
  @Column({ length: 100 })
  username: string;

  @Column({ length: 5000 })
  comment: string;

  @ManyToOne(() => Question, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Candidate, {
    nullable: false,
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;
}
