import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { AssessmentDocument } from './assessment.schema';
import { BaseDocument } from './base-document';

export type AssessmentBlockDocument = AssessmentBlock & Document;

@Schema({ collection: 'assessment-block' })
export class AssessmentBlock extends BaseDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instruction: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  sort_order: number;

  @Prop()
  closing_comments: string;

  @Prop()
  question_point: number;

  @Prop()
  random_questions: number;

  @Prop()
  shuffle_questions: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    immutable: true,
  })
  assessmentDocument: AssessmentDocument;
}

export const AssessmentBlockSchema =
  SchemaFactory.createForClass(AssessmentBlock);
