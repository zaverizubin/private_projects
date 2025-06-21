import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AssessmentBlock } from './assessment-block.entity';
import { AssetFile } from './asset-file.entity';
import { BaseModel } from './base-model.entity';
import { Organization } from './organization.entity';
import { AssessmentStatus } from 'src/enums/assessment.status';

@Entity({ name: 'assessment' })
export class Assessment extends BaseModel {
  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  position: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  department: string;

  @Column({ type: 'nvarchar', length: 5000, nullable: true })
  introduction: string;

  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @Column({ name: 'activated_on', nullable: true })
  activatedOn: Date;

  @Column({ name: 'deactivated_on', nullable: true })
  deactivatedOn: Date;

  @ManyToOne(() => Organization, {
    nullable: false,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToOne(() => AssetFile)
  @JoinColumn({ name: 'header_image_id' })
  headerImage: AssetFile;

  @Column({
    name: 'video_link_url',
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  videoLinkURL: string;

  @Column({ name: 'token', nullable: true })
  token: string;

  @OneToMany(
    () => AssessmentBlock,
    (assessmentBlock) => assessmentBlock.assessment,
    {
      cascade: true,
    },
  )
  assessmentBlocks: AssessmentBlock[];
}
