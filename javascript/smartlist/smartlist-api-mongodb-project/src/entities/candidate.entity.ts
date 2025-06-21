import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { AssetFile } from 'src/entities/asset-file.entity';
import { CandidateAssessment } from './candidate-assessment.entity';

@Entity({ name: 'candidate' })
export class Candidate extends BaseModel {
  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 255 })
  email: string;

  @Column({ name: 'contact_number' })
  contactNumber: string;

  @Column({ default: 0 })
  verified: boolean;

  @Column({ name: 'verification_code', nullable: true })
  verificationCode: number;

  @OneToOne(() => AssetFile, {
    nullable: true,
  })
  @JoinColumn({ name: 'photo_id' })
  photo: AssetFile;

  @OneToMany(
    () => CandidateAssessment,
    (candidateAssessment) => candidateAssessment.candidate,
    {
      cascade: true,
    },
  )
  candidateAssessments: CandidateAssessment[];
}
