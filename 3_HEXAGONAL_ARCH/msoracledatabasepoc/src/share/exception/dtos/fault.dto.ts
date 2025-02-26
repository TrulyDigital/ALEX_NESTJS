import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FaultDto{

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  transaction_id: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  status_code: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  error: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  message: string;

  
}