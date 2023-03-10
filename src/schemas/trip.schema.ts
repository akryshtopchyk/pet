import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Trip {
  @Prop()
  date: Date;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  sum: number;

  @Prop()
  arrivalTime: string;

  @Prop()
  departureTime: string;

  @Prop()
  seatCount: number;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
