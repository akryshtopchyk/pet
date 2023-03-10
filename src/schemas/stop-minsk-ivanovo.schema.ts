import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class StopMinskIvanovo {
  @Prop()
  name: string;

  @Prop()
  travelTime: number;
}

export const StopMinskIvanovoSchema =
  SchemaFactory.createForClass(StopMinskIvanovo);
