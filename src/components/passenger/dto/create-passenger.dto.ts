import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsBoolean()
  readonly isBlock: boolean;

  @IsString()
  @IsOptional()
  readonly note: string;
}
