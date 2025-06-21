import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AssetFileDocument } from './asset-file.schema';
import { BaseDocument } from './base-document';
import * as mongoose from 'mongoose';
import { QuestionDocument } from './question.schema';


export type CandidateResponseDocument = CandidateResponse & Document;

@Schema()
export class CandidateResponse extends BaseDocument {
    @Prop()
    answers: string;

    @Prop()
    answer_text: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssetFile',
        immutable: true,
    })
    assetFileDocument: AssetFileDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        immutable: true,
    })
    questionDocument: QuestionDocument;

}

export const CandidateResponseSchema = SchemaFactory.createForClass(CandidateResponse);
