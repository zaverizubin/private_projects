import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { AssetFileDocument } from './asset-file.schema';
import { BaseDocument } from './base-document';
import { OrganizationDocument } from './organization.schema';

export type AssessmentDocument = Assessment & Document;

@Schema()
export class Assessment extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  position: string;

  @Prop()
  department: string;

  @Prop()
  introduction: string;

  @Prop()
  activated_on: string;

  @Prop()
  deactivated_on: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetFile',
    immutable: true,
  })
  header_image: AssetFileDocument;

  @Prop()
  video_link_url: string;

  @Prop({
    required: true,
    enum: [
      AssessmentStatus.DRAFT,
      AssessmentStatus.ACTIVE,
      AssessmentStatus.ARCHIVED,
    ],
    default: AssessmentStatus.DRAFT,
  })
  status: string;

  @Prop({ immutable: true })
  token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    immutable: true,
  })
  organizationDocument: OrganizationDocument;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
