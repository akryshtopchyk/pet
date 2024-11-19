import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Passenger {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  isBlock: boolean;

  @Prop()
  note: string;
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
