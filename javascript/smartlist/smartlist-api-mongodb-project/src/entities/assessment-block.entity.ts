import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Assessment } from './assessment.entity';
import { BaseModel } from './base-model.entity';
import { Question } from './question.entity';

@Entity({ name: 'assessment_block' })
export class AssessmentBlock extends BaseModel {
  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @Column({ type: 'nvarchar', length: 5000 })
  instruction: string;

  @Column({ name: 'duration' })
  duration: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'closing_comments', length: 5000, nullable: true })
  closingComments: string;

  @ManyToOne(() => Assessment, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @OneToMany(() => Question, (question) => question.assessmentBlock, {
    cascade: true,
  })
  questions: Question[];

  @Column({ nullable: true })
  questionPoint: number;

  @Column({ nullable: true })
  randomQuestions: number;

  @Column({ default: 0 })
  suffleQuestions: boolean;
}
