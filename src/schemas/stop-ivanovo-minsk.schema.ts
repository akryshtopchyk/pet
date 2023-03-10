import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class StopIvanovoMinsk {
  @Prop()
  name: string;

  @Prop()
  travelTime: number;
}

export const StopIvanovoMinskSchema =
  SchemaFactory.createForClass(StopIvanovoMinsk);
