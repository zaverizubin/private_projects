import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class BaseDocument {
  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  modified_at: Date;
}
