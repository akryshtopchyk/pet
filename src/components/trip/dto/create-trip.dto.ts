import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsNumber()
  @IsNotEmpty()
  readonly sum: number;

  @IsString()
  @IsNotEmpty()
  readonly arrivalTime: string;

  @IsString()
  @IsNotEmpty()
  readonly departureTime: string;

  @IsNumber()
  @IsNotEmpty()
  readonly seatCount: number;
}
