import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AppStateService } from "../../share/services/app-state.service";
import { v4 as uuid } from "uuid";

@Injectable()
export class MiddlewareService implements NestMiddleware{

  constructor(
    private readonly app_state: AppStateService
  ){}

  use(
    request_express: Request, 
    response_express: Response, 
    next: NextFunction
  ): void {
    
    const transaction_id_header: string | string[] | undefined = request_express.headers['transactionid'];
    let transaction_id_new: string;

    if(Array.isArray(transaction_id_header)){
      transaction_id_new = transaction_id_header[0];
    }
    else if(!Array.isArray(transaction_id_header) && transaction_id_header !== undefined){
      transaction_id_new = transaction_id_header;
    }
    else{
      transaction_id_new = uuid();
    }

    this.app_state.set_transaction_id(transaction_id_new);

    const verb: string = request_express.method;
    this.app_state.set_verb(verb);

    response_express.set('transactionid', transaction_id_new);
    response_express.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    next();
  }
  
}