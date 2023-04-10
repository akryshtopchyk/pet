import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly tripId: ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly fromStop: string;

  @IsString()
  @IsNotEmpty()
  readonly fromStopTime: string;

  @IsString()
  @IsNotEmpty()
  readonly toStop: string;

  @IsString()
  @IsNotEmpty()
  readonly toStopTime: string;

  @IsNumber()
  @IsNotEmpty()
  readonly seatCount: number;

  @IsString()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  readonly date: Date;
}
