import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { ErrorCodes, ErrorMessages } from "../../enums/error-codes-and-messages.enum";
import { LegacyNames } from "../../enums/legacy-names.enum";
import { Type } from "class-transformer";

class ErrorDto{

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  code: ErrorCodes;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  message: ErrorMessages;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  legacy: LegacyNames;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  date_time: string;

  @IsDefined()
  @IsNotEmpty()
  description: string | string[];
}

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
  message: string;

  @ValidateNested()
  @Type(() => ErrorDto)
  error: ErrorDto;
}