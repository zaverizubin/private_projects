import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { QuestionType } from 'src/enums/question.type';
import { QuestionOptionReqDto } from 'src/modules/question/dto/request/options.req.dto';
import { AnswerOptionDocument } from './answer-option.schema';
import { AssessmentBlockDocument } from './assessment-block.schema';
import { BaseDocument } from './base-document';

export type QuestionDocument = Question & Document;

@Schema()
export class Question extends BaseDocument {
  @Prop({
    required: true,
    enum: [
      QuestionType.SCORED_MCQ_SINGLE,
      QuestionType.SCORED_MCQ_MULTIPLE,
      QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT,
      QuestionType.SURVEY,
      QuestionType.FILE_RESPONSE,
      QuestionType.TEXT_RESPONSE,
      QuestionType.VIDEO_RESPONSE,
    ],
  })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  sort_order: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentBlock',
    required: true,
    immutable: true,
  })
  assessmentBlockDocument: AssessmentBlockDocument;

  @Prop({ required: true })
  answerOptionDocuments: AnswerOptionDocument[];


  @Prop({ required: true })
  shuffle_options: boolean;

  @Prop({ required: false })
  options: QuestionOptionReqDto;


}

export const QuestionSchema = SchemaFactory.createForClass(Question);
