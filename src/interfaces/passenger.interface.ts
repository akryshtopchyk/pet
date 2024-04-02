import { Document } from 'mongoose';

export interface IPassenger extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly phoneNumber: string;
  readonly isBlock: boolean;
}
