import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';
import { FaultDto } from "../dtos/fault.dto";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{

  catch(exception: any, host: ArgumentsHost) {

    // get express context
    const context = host.switchToHttp();
    const request_express = context.getRequest<Request>();
    const response_express = context.getResponse<Response>();

    const catch_fault: FaultDto = exception.getResponse();

    return response_express
      .status(catch_fault.status_code)
      .setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      .json(catch_fault);
    
  }
  
}