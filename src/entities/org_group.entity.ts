import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type Org_GroupDocument = HydratedDocument<Org_Group>;

@Schema()
export class Org_Group {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, ref: 'Organization' })
  organization: string;

  @Prop({ type: [{ type: String, ref: 'Cus_Org_Info' }] })
  members: string[];

  @Prop()
  description: string;
}

export const Org_GroupSchema = SchemaFactory.createForClass(Org_Group);
