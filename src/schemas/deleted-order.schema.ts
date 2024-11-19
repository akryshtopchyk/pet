import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class DeletedOrder {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  tripId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fromStop: string;

  @Prop({ required: true })
  fromStopTime: string;

  @Prop({ required: true })
  toStop: string;

  @Prop({ required: true })
  toStopTime: string;

  @Prop({ required: true })
  seatCount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  date: Date;

  @Prop({ required: false })
  isApproved: boolean;
}

export const DeletedOrderSchema = SchemaFactory.createForClass(DeletedOrder);
