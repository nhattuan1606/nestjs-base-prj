import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema()
export class Organization {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: [{ type: String, ref: 'Customer' }] })
  members: string[];

  @Prop({ type: [{ type: String, ref: 'Customer' }] })
  owners: string[];

  @Prop({ type: [{ type: String, ref: 'Customer' }] })
  invited_members: string[];

  @Prop({ type: [{ type: String, ref: 'Org_Department' }] })
  deparment_list: string[];

  @Prop({ type: [{ type: String, ref: 'Org_Group' }] })
  group_list: string[];

  @Prop({ trim: true })
  logo: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
