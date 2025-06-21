import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AssetFileDocument } from './asset-file.schema';
import { BaseDocument } from './base-document';
import * as mongoose from 'mongoose';

export type CandidateDocument = Candidate & Document;

@Schema()
export class Candidate extends BaseDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  contact_number: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop()
  verification_code: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetFile',
    immutable: false,
  })
  photo: AssetFileDocument;


}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
