import { Document } from 'mongoose';

export interface INews extends Document {
  readonly title: string;
  readonly text: string;
  readonly createdAt: Date;
}
