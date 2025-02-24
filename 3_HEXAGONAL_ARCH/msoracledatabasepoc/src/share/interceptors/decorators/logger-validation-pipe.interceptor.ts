import { LoggerRepository } from "src/domain/repositories/logger.repository";
import { AppStateService } from "../../state/app-state.service";
import { DataConfigInterfaceDto } from "../../config/dtos/data-config-interface.dto";
import { LoggerEntity } from "src/domain/entities/logger.entity";
import { tools } from "../../tools/tools";

export function LoggerValidationPipeInteceptor<IN,OUT,FAULT>(): InterceptorType{
  return function (
    target: any, 
    propertyKey: string, 
    descriptor: PropertyDescriptor
  ): void{

    // get original method
    const original_method = descriptor.value;

    // overwrite method
    descriptor.value = function (
      ...args: any[]
    ): OUT {

      // -------------------------
      // before
      // -------------------------

      // services
      const app_state: AppStateService = this.get_app_state();
      const logger: LoggerRepository = this.get_logger_repository();

      // data
      const env_data: DataConfigInterfaceDto = this.get_data_config();
      const transaction_id: string = app_state.get_transaction_id();
      const verb: string = app_state.get_verb();
      const body_in: IN = this.get_body_in();

      // lo entity
      let logger_entity = new LoggerEntity<IN,OUT,FAULT>(
        env_data.application_name,
        env_data.operation_controller,
      );
      logger_entity.set_verb(verb);
      logger_entity.set_transaction_id(transaction_id);
      logger_entity.set_layer('Controller');
      logger_entity.set_request(body_in);
      const init_time: number = new Date().getTime();

      // -------------------------
      // execute original method
      // -------------------------
      
      const result_method: OUT = original_method.apply(this, args);
      const end_time: number = new Date().getTime();

      // -------------------------
      // after error
      // -------------------------

      // we are in http exception flow so we are in catch block

      logger_entity.set_type('error');
      logger_entity.set_message('error from controller');
      logger_entity.set_processing_time(end_time-init_time);
      logger_entity.set_time_stamp(tools.get_current_date());
      logger_entity.set_response(result_method);

      logger.write<IN,OUT,FAULT>(logger_entity);
      return result_method;
    };
  };
}