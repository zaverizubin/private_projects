import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';

export type EmailLogDocument = EmailLog & Document;

@Schema({ collection: 'email-log' })
export class EmailLog extends BaseDocument {
  @Prop({ required: true })
  status: boolean;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop()
  error_log: string;

  @Prop()
  message: string;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);
