import { HttpException } from "@nestjs/common";
import { LoggerEntity } from "../../domain/entities/logger.entity";
import { LoggerRepository } from "../../domain/repositories/logger.repository";
import { DataConfigInterfaceDto } from "../../share/dtos/data-config-interface.dto";
import { AppStateService } from "../../share/services/app-state.service";
import { tools } from "../../share/tools/tools";

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
      let log: LoggerRepository = this.get_logger_repository();

      // data
      const env_data: DataConfigInterfaceDto = this.get_data_config();
      const transaction_id: string = app_state.get_transaction_id();
      const verb: string = app_state.get_verb();

      // log entity
      let log_entity = new LoggerEntity<IN,OUT,FAULT>(
        env_data.application_name, 
        env_data.operation_controller,
      );
      log_entity.set_verb(verb);
      log_entity.set_transaction_id(transaction_id);
      log_entity.set_layer('Controller');
      log_entity.set_request(args[0] as IN);
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
        log_entity.set_type('info');
        log_entity.set_message('success');
        log_entity.set_processing_time(end_time-init_time);
        log_entity.set_time_stamp(tools.get_current_date());
        log_entity.set_response(method_result);
        
        log.write<IN,OUT,FAULT>(log_entity);
        return result;
      }
      catch(err: any){

        // -------------------------
        // after error
        // -------------------------

        const end_time: number = new Date().getTime();

        log_entity.set_type('error');
        log_entity.set_message('error from controller');
        log_entity.set_processing_time(end_time-init_time);
        log_entity.set_time_stamp(tools.get_current_date());

        if(err instanceof HttpException){
          const fault: FAULT = err.getResponse() as FAULT;
          log_entity.set_response(fault);
        }
        else{
          log_entity.set_response(JSON.stringify(err));
        }

        log.write<IN,OUT,FAULT>(log_entity);
        throw err;
      }
    }
  }
}