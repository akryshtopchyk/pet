import { Document } from 'mongoose';

export interface IStopIvanovoMinsk extends Document {
  readonly name: string;
  readonly travelTime: number;
}
