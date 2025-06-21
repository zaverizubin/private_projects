import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { AssetFile, AssetFileDocument } from './asset-file.schema';
import { BaseDocument } from './base-document';
import { UserInvite, UserInviteSchema } from './user-invite.schema';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  url: string;

  @Prop()
  contact_number: string;

  @Prop()
  about: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetFile',
  })
  logo: AssetFileDocument;

  @Prop()
  email: string;

}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.pre('save', function () {
  this.set({ modified_at: Date.now });
});
