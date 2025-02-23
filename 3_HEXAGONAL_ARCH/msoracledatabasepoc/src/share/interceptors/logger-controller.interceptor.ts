import { HttpException } from "@nestjs/common";
import { LoggerEntity } from "../../domain/entities/logger.entity";
import { LoggerRepository } from "../../domain/repositories/logger.repository";
import { DataConfigInterfaceDto } from "../dtos/data-config-interface.dto";
import { AppStateService } from "../services/app-state.service";
import { tools } from "../tools/tools";

export function LoggerControllerInterceptor<IN,OUT,FAULT>(): InterceptorType{
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void{

    // get original method 
    const original_method = descriptor.value;

    // overwrite method
    descriptor.value = async function(
      ...args: unknown[]
    ): Promise<OUT>{

      // -------------------------
      // before
      // -------------------------

      // services
      const app_state: AppStateService = this.get_app_state();
      const logger: LoggerRepository = this
        .get_register_resources_service()
        .get_logger_repository();

      // data
      const transaction_id: string = app_state.get_transaction_id();
      const verb: string = app_state.get_verb();
      const env_data: DataConfigInterfaceDto = this
        .get_register_resources_service()
        .get_data_config();

      // log entity
      let logger_entity = new LoggerEntity<IN,OUT,FAULT>(
        env_data.application_name, 
        env_data.operation_controller,
      );
      logger_entity.set_verb(verb);
      logger_entity.set_transaction_id(transaction_id);
      logger_entity.set_layer('Controller');
      logger_entity.set_request(args[0] as IN);
      const init_time: number = new Date().getTime();
     
      try{
        
        // -------------------------
        // execute original method
        // -------------------------
        
        const result: Promise<OUT> = await original_method.apply(this, args);
        const end_time: number = new Date().getTime();

        // -------------------------
        // after success
        // -------------------------

        const method_result = await result;
        logger_entity.set_type('info');
        logger_entity.set_message('success');
        logger_entity.set_processing_time(end_time-init_time);
        logger_entity.set_time_stamp(tools.get_current_date());
        logger_entity.set_response(method_result);
        
        logger.write<IN,OUT,FAULT>(logger_entity);
        return result;
      }
      catch(err: any){

        // -------------------------
        // after error
        // -------------------------

        const end_time: number = new Date().getTime();

        logger_entity.set_type('error');
        logger_entity.set_message('error from controller');
        logger_entity.set_processing_time(end_time-init_time);
        logger_entity.set_time_stamp(tools.get_current_date());

        if(err instanceof HttpException){
          const fault: FAULT = err.getResponse() as FAULT;
          logger_entity.set_response(fault);
        }
        else{
          logger_entity.set_response(JSON.stringify(err));
        }

        logger.write<IN,OUT,FAULT>(logger_entity);
        throw err;
      }
    }
  }
}