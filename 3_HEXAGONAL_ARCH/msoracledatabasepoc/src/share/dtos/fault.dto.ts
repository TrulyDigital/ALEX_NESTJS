import { ErrorCodes, ErrorMessages } from "../enums/error-codes.enum";
import { LegacyNames } from "../enums/legacy-names.enum";

class ErrorDto{
  code: ErrorCodes;
  message: ErrorMessages;
  legacy: LegacyNames;
  date_time: string;
  description: string | string[];
}

export class FaultDto{
  transaction_id: string;
  status_code: number;
  message: string;
  error: ErrorDto;
}