import { Document, ObjectId } from 'mongoose';

export interface IOrder extends Document {
  readonly passengerId: ObjectId;
  readonly tripId: ObjectId;
  readonly fromStop: string;
  readonly fromStopTime: string;
  readonly toStop: string;
  readonly toStopTime: string;
  readonly seatCount: number;
  readonly description: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber: string;
}
