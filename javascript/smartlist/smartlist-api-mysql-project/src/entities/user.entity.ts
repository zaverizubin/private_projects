import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AssetFile } from './asset-file.entity';
import { Organization } from './organization.entity';
import { BaseModel } from './base-model.entity';

@Entity({ name: 'user' })
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'boolean',
    default: 0,
    comment: 'Has the user verified email',
  })
  active: boolean;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  role: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  department: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  designation: string;

  @OneToOne(() => AssetFile, {
    nullable: true,
  })
  @JoinColumn({ name: 'photo_id' })
  photo: AssetFile;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
