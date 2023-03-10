import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStopMinskIvanovoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly travelTime: number;
}
