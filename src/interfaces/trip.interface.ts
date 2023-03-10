import { Document, ObjectId } from 'mongoose';

export interface ITrip extends Document {
  readonly date: Date;
  readonly from: string;
  readonly to: string;
  readonly sum: number;
  readonly arrivalTime: string;
  readonly departureTime: string;
  readonly seatCount: number;
  readonly arrivalStops: Array<ObjectId>;
  readonly departureStops: Array<ObjectId>;
  readonly orders?: number;
}
