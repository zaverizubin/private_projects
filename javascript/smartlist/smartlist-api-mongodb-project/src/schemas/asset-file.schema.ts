import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './base-document';

export type AssetFileDocument = AssetFile & Document;

@Schema({ collection: 'asset-files' })
export class AssetFile extends BaseDocument {
  @Prop({ required: true })
  original_name: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, default: 'local' })
  disk: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  mime_type: string;
}

export const AssetFileSchema = SchemaFactory.createForClass(AssetFile);
