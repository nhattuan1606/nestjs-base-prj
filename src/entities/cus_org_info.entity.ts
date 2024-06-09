import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type Cus_Org_InfoDocument = HydratedDocument<Cus_Org_Info>;

@Schema()
export class Cus_Org_Info {
  @Prop({ required: true, ref: 'Customer' })
  customer_id: string;
  
  @Prop({ required: true, trim: true })
  email: string;
  
  @Prop({ trim: true })
  name: string;
  
  @Prop({ trim: true })
  phone: string;
  
  @Prop({ trim: true })
  avatar: string;
  
  @Prop({ trim: true })
  bio: string;
  
  @Prop({ required: true })
  status: number;
  
  @Prop({ required: true, ref: 'Cus_Org_Info' })
  Cus_Org_Info_id: string;

  @Prop({ ref: 'Org_Department' })
  department: string;

  @Prop()
  role_department: number;

  @Prop({ type: [{ type: String, ref: 'Org_Group' }] })
  group: string[];

  @Prop({ ref: 'Cus_Org_Info' })
  parent: string;

  @Prop({ type: [{ type: String, ref: 'Cus_Org_Info' }] })
  children: string[];
}


export const Cus_Org_InfoSchema = SchemaFactory.createForClass(Cus_Org_Info);
