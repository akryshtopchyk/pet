import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStopIvanovoMinskDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly travelTime: number;
}
