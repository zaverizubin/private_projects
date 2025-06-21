import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { Candidate } from './candidate.entity';
import { User } from './user.entity';

@Entity({ name: 'authorized_token' })
export class AuthorizedToken extends BaseModel {
  @Column()
  refresh_token_hash: string;

  @Column()
  access_token_hash: string;

  @OneToOne(() => Candidate, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @OneToOne(() => User, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
