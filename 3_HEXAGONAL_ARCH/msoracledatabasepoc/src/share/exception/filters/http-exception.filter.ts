import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from "@nestjs/common";
import { Request, Response } from 'express';
import { FaultDto } from "../dtos/fault.dto";
import { plainToInstance } from "class-transformer";
import { FaultNestDto } from "../dtos/fault-nestjs.dto";
import { validate, ValidationError } from "class-validator";
import { AppStateService } from "../../state/app-state.service"
import { LegacyNames } from "../../enums/legacy-names.enum";
import { ErrorCodes, ErrorMessages } from "../../enums/error-codes-and-messages.enum";
import { HttpVerbs } from "../../enums/http-verbs.enum";
import { LoggerRepository } from "../../../domain/repositories/logger.repository";
import { DataConfigRepository } from "../../../domain/repositories/data-config.repository";
import { DataConfigInterfaceDto } from "../../config/dtos/data-config-interface.dto";
import { LoggerValidationPipeInteceptor } from "../../interceptors/decorators/logger-validation-pipe.interceptor";
import { tools } from "../../tools/tools";

type IN = unknown;
type OUT = FaultDto;
type FAULT = FaultDto;

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{

  //
  private body_in: unknown;

  constructor(
    private readonly app_state: AppStateService,
    @Inject(DataConfigRepository) private readonly env_data: DataConfigRepository,
    @Inject(LoggerRepository) private readonly winston: LoggerRepository,
  ){}

  /**
   * 
   * @description
   * 
   * Getters
   * 
   */

  get_body_in(): unknown{
    return this.body_in;
  }

  get_app_state(): AppStateService{
    return this.app_state;
  }

  get_data_config(): DataConfigInterfaceDto{
    return this.env_data.get_data_config_interface();
  }

  get_logger_repository(): LoggerRepository{
    return this.winston;
  }

  /**
   * 
   * @description
   * 
   * Catch all Http Exceptions
   * 
   */

  async catch(exception: any, host: ArgumentsHost){

    // get express context
    const context = host.switchToHttp();
    const request_express = context.getRequest<Request>();
    const response_express = context.getResponse<Response>();

    // catch fault
    const catch_fault = exception.getResponse();

    // is this a custom fault?
    const validate_custom_fault: FaultDto = plainToInstance(
      FaultDto, 
      catch_fault
    );
    const validation_error_custom_fault: ValidationError[] = await validate(
      validate_custom_fault
    );

    // is this a nesjs fault?
    const validate_nestjs_fault: FaultNestDto = plainToInstance(
      FaultNestDto, 
      catch_fault
    );
    const validation_error_nestjs_fault: ValidationError[] = await validate(
      validate_nestjs_fault
    );

    // internal error controlled by the microservice - custom fault
    // it already includes a logger
    if(validation_error_custom_fault.length === 0){
      let fault: FaultDto = catch_fault as unknown as FaultDto;
      return response_express
        .status(fault.status_code)
        .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        .json(fault);
    }

    // get method and request (body or uri)

    const request_method: HttpVerbs = this.validate_request_method(
      request_express.method,
    );

    this.body_in = this.get_request_body(
      request_method,
      request_express,
    );

    // error thrown for @UsePipes decorator - interface layer - nestjs fault
    // it doesn't include a logger yet
    if(validation_error_nestjs_fault.length === 0){

      const fault_response: FaultDto = this.get_new_fault_from_nestjs_fault(
        catch_fault,
      );

      return response_express
        .status(fault_response.status_code)
        .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        .json(fault_response);
    }

    // if fault is not known
    return response_express.status(500).json(catch_fault);

  }

  
  /**
   * 
   * @description
   * 
   * Private method class 
   * 
   */

  @LoggerValidationPipeInteceptor<IN,OUT,FAULT>()
  private get_new_fault_from_nestjs_fault(
    catch_fault: any,
  ): FaultDto{

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

    return fault_response;
  }

  private validate_request_method(
    method: string | undefined
  ): HttpVerbs{
    const exist_method: boolean = Object.values(HttpVerbs).includes(method as HttpVerbs);
    if(exist_method) return method as HttpVerbs;
    else return HttpVerbs.NONE;
  }

  private get_request_body(
    method: HttpVerbs,
    request_express: Request,
  ): unknown{
    switch(method){
      case HttpVerbs.GET: 
        return request_express.query;
      case HttpVerbs.DELETE: 
        return request_express.body;
      case HttpVerbs.POST: 
        return request_express.body;
      case HttpVerbs.PUT: 
        return request_express.body;
      case HttpVerbs.PATCH: 
        return request_express.body;
      default:
        return undefined;
    }
  }

  private get_error_message_from_status_code(
    code: number
  ): ErrorMessages{
    switch(code){
      case 400: return ErrorMessages.MSG_100_1;
      case 404: return ErrorMessages.MSG_100_2;
      default: return ErrorMessages.MSG_111;
    }
  }

  private get_error_code_from_status_code(
    code: number
  ): ErrorCodes{
    switch(code){
      case 400: return ErrorCodes.ERR_100;
      case 404: return ErrorCodes.ERR_100;
      default: return ErrorCodes.ERR_111;
    }
  }
}