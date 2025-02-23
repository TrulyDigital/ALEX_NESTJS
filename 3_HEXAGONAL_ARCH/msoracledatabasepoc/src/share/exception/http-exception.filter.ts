import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';
import { FaultDto } from "../dtos/fault.dto";
import { plainToInstance } from "class-transformer";
import { FaultNestDto } from "../dtos/fault-nestjs.dto";
import { validate, ValidationError } from "class-validator";
import { AppStateService } from "../services/app-state.service";
import { tools } from "../tools/tools";
import { LegacyNames } from "../enums/legacy-names.enum";
import { ErrorCodes, ErrorMessages } from "../enums/error-codes-and-messages.enum";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{

  constructor(
    private readonly app_state: AppStateService,
  ){}

  async catch(exception: any, host: ArgumentsHost){

    // get express context
    const context = host.switchToHttp();
    const request_express = context.getRequest<Request>();
    const response_express = context.getResponse<Response>();

    
    const catch_fault = exception.getResponse();

    const validate_custom_fault: FaultDto = plainToInstance(
      FaultDto, 
      catch_fault
    );
    const validation_error_custom_fault: ValidationError[] = await validate(
      validate_custom_fault
    );

    const validate_nestjs_fault: FaultNestDto = plainToInstance(
      FaultNestDto, 
      catch_fault
    );
    const validation_error_nestjs_fault: ValidationError[] = await validate(
      validate_nestjs_fault
    );

    // internal error controlled by the microservice
    if(validation_error_custom_fault.length === 0){
      let fault: FaultDto = catch_fault as unknown as FaultDto;
      return response_express
        .status(fault.status_code)
        .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        .json(fault);
    }

    // error thrown for @UsePipes decorator - interface layer
    if(validation_error_nestjs_fault.length === 0){

      let fault: FaultNestDto = catch_fault as unknown as FaultNestDto;
      const status_code: number = fault.statusCode;

      let message_ext: string;
      if(fault.error !== undefined) message_ext = fault.error;
      else message_ext = 'Internal Server Error';

      const fault_response: FaultDto = {
        transaction_id: this.app_state.get_transaction_id(),
        status_code: fault.statusCode,
        message: message_ext,
        error: {
          code: this.get_error_code_from_status_code(status_code),
          message: this.get_error_message_from_status_code(status_code),
          legacy: LegacyNames.LEGACY_OC,
          date_time: tools.get_current_date(),
          description: fault.message,
        }
      };

      return response_express
        .status(fault_response.status_code)
        .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        .json(fault_response);
    }

    // if fault is not known
    return response_express.status(500).json(catch_fault);

  }

  private get_error_message_from_status_code(code: number): ErrorMessages{
    switch(code){
      case 400: return ErrorMessages.MSG_100_1;
      case 404: return ErrorMessages.MSG_100_2;
      default: return ErrorMessages.MSG_111;
    }
  }

  private get_error_code_from_status_code(code: number): ErrorCodes{
    switch(code){
      case 400: return ErrorCodes.ERR_100;
      case 404: return ErrorCodes.ERR_100;
      default: return ErrorCodes.ERR_111;
    }
  }
  
}