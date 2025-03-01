import { ValidationError } from "class-validator";
import { fromZonedTime, format } from "date-fns-tz";
import { createLogger } from "winston";
import * as winston from 'winston';
import { format as winston_format } from 'winston';

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

function get_winston_instance(): winston.Logger{
  const winston_logger = createLogger({
    transports: [new winston.transports.Console({format: winston.format.json()})]
  });
  return winston_logger;
}

export const tools = {
  get_current_date,
  get_description_errors_after_validation,
  //
  get_winston_instance,
}