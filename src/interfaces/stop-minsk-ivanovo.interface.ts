import { Document } from 'mongoose';

export interface IStopMinskIvanovo extends Document {
  readonly name: string;
  readonly travelTime: number;
}
