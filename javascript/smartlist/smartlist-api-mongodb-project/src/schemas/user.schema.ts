import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { AssetFileDocument } from './asset-file.schema';
import { BaseDocument } from './base-document';
import { OrganizationDocument } from './organization.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    validate: {
      validator: function (v: string) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  active: boolean;

  @Prop()
  role: string;

  @Prop()
  department: string;

  @Prop()
  designation: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetFile',
  })
  photo: AssetFileDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  })
  organizationDocument: OrganizationDocument;

  @Prop(
    raw({
      token: { type: String },
      created_at: { type: Date, default: Date.now },
    }),
  )
  email_verification: Record<string, any>;

  @Prop(
    raw({
      token: { type: String },
      created_at: { type: Date, default: Date.now },
    }),
  )
  forgot_password: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
