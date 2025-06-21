import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Assessment } from './assessment.entity';
import { AssetFile } from './asset-file.entity';
import { BaseModel } from './base-model.entity';
import { User } from './user.entity';

@Entity({ name: 'organization' })
export class Organization extends BaseModel {
  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  url: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_number: string;

  @Column({ type: 'nvarchar', length: 5000, nullable: true })
  about: string;

  @OneToOne(() => AssetFile, {
    nullable: true,
  })
  @JoinColumn({ name: 'logo_id' })
  logo: AssetFile;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Assessment, (assessment) => assessment.organization)
  assessments: Assessment[];
}
