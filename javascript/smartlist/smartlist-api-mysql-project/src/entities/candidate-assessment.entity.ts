import { AssessmentDecision } from 'src/enums/assessment.decision';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AssessmentBlock } from './assessment-block.entity';
import { Assessment } from './assessment.entity';
import { BaseModel } from './base-model.entity';
import { CandidateResponse } from './candidate-response.entity';
import { Candidate } from './candidate.entity';

@Entity({ name: 'candidate_assessment' })
export class CandidateAssessment extends BaseModel {
  @Column({
    type: 'datetime',
    name: 'start_date',
    nullable: true,
  })
  startDate: Date;

  @Column({
    type: 'datetime',
    name: 'end_date',
    nullable: true,
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: CandidateAssessmentStatus,
    default: CandidateAssessmentStatus.IN_PROGRESS,
  })
  status: CandidateAssessmentStatus;

  @Column({
    type: 'enum',
    enum: AssessmentDecision,
    nullable: true,
  })
  assessmentDecision: AssessmentDecision;

  @ManyToOne(() => AssessmentBlock, {
    nullable: false,
  })
  @JoinColumn({ name: 'active_assessment_block_id' })
  assessmentBlock: AssessmentBlock;

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

  @OneToMany(
    () => CandidateResponse,
    (candidateResponse) => candidateResponse.candidateAssessment,
  )
  candidateResponse: CandidateResponse;
}
