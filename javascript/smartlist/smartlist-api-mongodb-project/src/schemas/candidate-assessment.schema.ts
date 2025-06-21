import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { BaseDocument } from './base-document';
import { AssessmentBlockDocument } from './assessment-block.schema';
import { AssessmentDocument } from './assessment.schema';
import { CandidateDocument } from './candidate.schema';
import { CandidateResponseDocument } from './candidate-response.schema';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';

export type CandidateAssessmentDocument = CandidateAssessment & Document;

@Schema({ collection: 'candidate-assessments' })
export class CandidateAssessment extends BaseDocument {
  @Prop({ required: true })
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop({
    enum: [
      CandidateAssessmentStatus.IN_PROGRESS,
      CandidateAssessmentStatus.GRADING_PENDING,
      CandidateAssessmentStatus.GRADING_COMPLETED,
    ],
  })
  status: CandidateAssessmentStatus;


  @Prop({
    enum: [
      AssessmentDecision.PENDING,
      AssessmentDecision.ON_HOLD,
      AssessmentDecision.REGRET,
      AssessmentDecision.SHORTLISTED,
      AssessmentDecision.SMARTLISTED,
    ],
  })
  assessment_decision: AssessmentDecision;

  @Prop()
  candidateResponseDocuments: CandidateResponseDocument[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentBlock',
    required: true,
    immutable: true,
  })
  assessmentBlockDocument: AssessmentBlockDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    immutable: true,
  })
  assessmentDocument: AssessmentDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
    immutable: true,
  })
  candidateDocument: CandidateDocument;
}

export const CandidateAssessmentSchema = SchemaFactory.createForClass(CandidateAssessment);
