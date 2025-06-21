import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { CandidateAssessment } from './candidate-assessment.entity';
import { Question } from './question.entity';
import { AssetFile } from './asset-file.entity';

@Entity({ name: 'candidate_response' })
export class CandidateResponse extends BaseModel {
  @Column({ name: 'answer_ids', nullable: true })
  answers: string;

  @Column({ length: 5000, nullable: true })
  answerText: string;

  @OneToOne(() => AssetFile, {
    nullable: true,
  })
  @JoinColumn({ name: 'file_id' })
  file: AssetFile;

  @ManyToOne(() => Question, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => CandidateAssessment, {
    nullable: false,
  })
  @JoinColumn({ name: 'candidate_assessment_id' })
  candidateAssessment: CandidateAssessment;
}
