import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FaultNestDto{

  @IsNotEmpty()
  @IsDefined()
  message: string | string [];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  error?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;
}