import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';
import { CandidateDocument } from './candidate.schema';
import { QuestionDocument } from './question.schema';

export type QuestionCommentDocument = QuestionComment & Document;

@Schema({ collection: 'question-comments' })
export class QuestionComment extends BaseDocument {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  comment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  })
  questionDocument: QuestionDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  })
  candidateDocument: CandidateDocument;
}

export const QuestionCommentSchema =
  SchemaFactory.createForClass(QuestionComment);
