import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class News {
  @Prop()
  createdAt: Date;

  @Prop()
  title: string;

  @Prop()
  text: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
