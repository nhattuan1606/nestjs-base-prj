import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: String, ref: 'Organization' }] })
  organization_list: string[];

  @Prop()
  refresh_token: string;

  @Prop({ required: true })
  status: number;

  @Prop()
  key: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
