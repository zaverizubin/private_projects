import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AssessmentBlock } from './assessment-block.entity';
import { Assessment } from './assessment.entity';
import { BaseModel } from './base-model.entity';
import { Candidate } from './candidate.entity';
import { Question } from './question.entity';

@Entity({ name: 'candidate_response_score' })
@Unique('candidate_response_score_idx', [
  'candidate',
  'assessment',
  'assessmentBlock',
  'question',
])
export class CandidateResponseScore extends BaseModel {
  @ManyToOne(() => Candidate, {
    nullable: false,
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToOne(() => Assessment, {
    nullable: false,
  })
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => AssessmentBlock, {
    nullable: false,
  })
  @JoinColumn({ name: 'assessment_block_id' })
  assessmentBlock: AssessmentBlock;

  @ManyToOne(() => Question, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column()
  score: number;
}
