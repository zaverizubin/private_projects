import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CandidateDocument } from './candidate.schema';
import { AssessmentDocument } from './assessment.schema';

export type CandidateAttemptLogDocument = CandidateAttemptLog & Document;

@Schema({ collection: 'candidate-attempt-log' })
export class CandidateAttemptLog {
    @Prop({ default: Date.now })
    attempted_on: Date;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandidateDocument',
        immutable: true,
    })
    candidateDocument: CandidateDocument;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentDocument',
        immutable: true,
    })
    assessmentDocument: AssessmentDocument;

}

export const CandidateAttemptLogSchema = SchemaFactory.createForClass(CandidateAttemptLog);
