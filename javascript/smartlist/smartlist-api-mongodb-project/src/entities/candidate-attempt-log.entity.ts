import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Candidate } from './candidate.entity';

@Entity({ name: 'candidate_attempt_log' })
export class CandidateAttemptLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'attempted_on' })
  attemptedOn: Date;

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
}
