import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity({ name: 'email_log' })
export class EmailLog extends BaseModel {
  @Column()
  status: boolean;

  @Column({ type: 'nvarchar', length: 255 })
  sender: string;

  @Column({ type: 'nvarchar', length: 255 })
  receiver: string;

  @Column({ name: 'error_log', type: 'text', nullable: true })
  error_log: string;

  @Column({ name: 'message', type: 'text' })
  message: string;
}
