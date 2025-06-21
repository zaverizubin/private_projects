import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity({ name: 'sms_log' })
export class CandidateSmsLog extends BaseModel {
  @Column()
  status: string;

  @Column({ type: 'nvarchar', length: 255 })
  sender: string;

  @Column({ type: 'nvarchar', length: 255 })
  receiver: string;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'nvarchar', length: 255 })
  uid: string;
}
