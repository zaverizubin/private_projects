import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';
import { OrganizationDocument } from './organization.schema';
import * as mongoose from 'mongoose';

export type UserInviteDocument = UserInvite & Document;

@Schema({ collection: 'user-invites' })
export class UserInvite extends BaseDocument {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationDocument: OrganizationDocument;
}

export const UserInviteSchema = SchemaFactory.createForClass(UserInvite);
