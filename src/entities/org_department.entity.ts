import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type Org_DepartmentDocument = HydratedDocument<Org_Department>;

@Schema()
export class Org_Department {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, ref: 'Organization' })
  organization: string;

  @Prop({ type: [{ type: String, ref: 'Cus_Org_Info' }] })
  members: string[];

  @Prop({ ref: 'Cus_Org_Info' })
  owners: string;
}

export const Org_DepartmentSchema = SchemaFactory.createForClass(Org_Department);
