import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';
import { Candidate, CandidateDocument } from './candidate.schema';
import { User, UserDocument } from './user.schema';

export type AuthorizedTokenDocument = AuthorizedToken & Document;

@Schema({ collection: 'authorized-tokens' })
export class AuthorizedToken extends BaseDocument {
  @Prop({ required: true })
  access_token_hash: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
  })
  candidateDocument: CandidateDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userDocument: UserDocument;
}

export const AuthorizedTokenSchema =
  SchemaFactory.createForClass(AuthorizedToken);
