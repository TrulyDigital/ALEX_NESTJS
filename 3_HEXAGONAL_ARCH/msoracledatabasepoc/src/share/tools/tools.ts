import { ValidationError } from "class-validator";
import { fromZonedTime, format } from "date-fns-tz";
import { FaultDto } from "../exception/dtos/fault.dto";
import { ErrorCodes, ErrorMessages } from "../enums/error-codes-and-messages.enum";
import { LegacyNames } from "../enums/legacy-names.enum";

/**
 * 
 * @description
 * 
 * Obtener la fecha actual en formato
 * `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`
 * 
 */
function get_current_date(): string{
  const date = new Date();
    const time_zone: string = 'America/Bogota';
    const utc_date = fromZonedTime(date, time_zone);
    const format_date = format(
      utc_date,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      { timeZone: time_zone }, 
    );
    return format_date;
}

function get_description_errors_after_validation(
  validation_error: ValidationError[]
): string[]{

  let description_errors: string[] = [];
  validation_error.forEach(element => {
    const constraints = element.constraints;
    if(constraints !== undefined){
      Object.keys(constraints).forEach(key => {
        description_errors.push(constraints[key]);
      });
    }
  });
  return description_errors;
}

function get_fault_CODE_001(
  error_message: string,
  transaction_id: string,
  legacy: LegacyNames,
): FaultDto{

  const fault: FaultDto = {
    transaction_id: transaction_id,
    status_code: 500,
    message: 'Internal Server Error',
    error: {
      code: ErrorCodes.ERR_001,
      message: ErrorMessages.MSG_001_1,
      legacy: legacy,
      date_time: tools.get_current_date(),
      description: [
        String(error_message)
      ]
    }
  };

  return fault;
}

function get_fault_CODE_002(
  error_message: string,
  transaction_id: string,
  legacy: LegacyNames,
): FaultDto{

  const fault: FaultDto = {
    transaction_id: transaction_id,
    status_code: 504,
    message: 'Gateway Timeout',
    error: {
      code: ErrorCodes.ERR_001,
      message: ErrorMessages.MSG_001_2,
      legacy: legacy,
      date_time: tools.get_current_date(),
      description: [
        String(error_message)
      ]
    }
  };

  return fault;
}

export const tools = {
  get_current_date,
  get_description_errors_after_validation,
  //
  get_fault_CODE_001,
  get_fault_CODE_002,
}