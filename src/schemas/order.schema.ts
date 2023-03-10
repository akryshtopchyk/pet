import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Order {
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
}

export const OrderSchema = SchemaFactory.createForClass(Order);
