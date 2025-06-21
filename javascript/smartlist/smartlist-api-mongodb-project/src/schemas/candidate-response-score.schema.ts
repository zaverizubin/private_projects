import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AssessmentDocument } from './assessment.schema';
import { BaseDocument } from './base-document';
import { AssessmentBlockDocument } from './assessment-block.schema';
import { QuestionDocument } from './question.schema';
import { CandidateDocument } from './candidate.schema';

export type CandidateResponseScoreDocument = CandidateResponseScore & Document;

@Schema({ collection: 'candidate-response-scores' })
export class CandidateResponseScore extends BaseDocument {
    @Prop({ required: true })
    score: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
        immutable: true,
    })
    assessmentDocument: AssessmentDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentBlock',
        required: true,
        immutable: true,
    })
    assessmentBlockDocument: AssessmentBlockDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        immutable: true,
    })
    questionDocument: QuestionDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        immutable: true,
    })
    candidateDocument: CandidateDocument;
}

export const CandidateResponseScoreSchema = SchemaFactory.createForClass(CandidateResponseScore);
