import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';

export type AnswerOptionDocument = AnswerOption & Document;

@Schema()
export class AnswerOption extends BaseDocument {
  @Prop({ required: true })
  correct: boolean;

  @Prop({ required: true })
  text: string;

  @Prop({ required: false })
  score: number;
}

export const AnswerOptionSchema = SchemaFactory.createForClass(AnswerOption);
