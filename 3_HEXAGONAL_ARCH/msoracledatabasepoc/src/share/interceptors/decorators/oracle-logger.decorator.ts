
import { LoggerEntity } from "../../logger/entities/logger.entity";
import { LoggerRepository } from "../../logger/repositories/logger.repository";
import { OracleConnectionDto } from "../../adapters/oracle/dtos/oracle-connection.dto";
import { tools } from "../../tools/tools";
import { AppStateService } from "../../state/app-state.service";
import { DataConfigInfraestructureDto } from "../../config/dtos/data-config-infraestructure.dto";
import { LayerNames } from "../../enums/layer-names.enum";

export function OracleLogger<IN,OUT,CATCH>(): InterceptorType{
  return function(
    target: Object,
    property_key: string | symbol, // method name or class name, it depends on the execution context
    descriptor: PropertyDescriptor // implementation of the method
  ): void{

    // get original method
    const original_method = descriptor.value;
      
    // overwrite method
    descriptor.value = async function (
      timeout: string,
      oracle_connection: OracleConnectionDto,
      string_contract: string,
      object_contract: any
    ): Promise<OUT> {

      // -------------------------
      // before
      // -------------------------

      // services
      const app_state: AppStateService = this.get_app_state();
      let logger: LoggerRepository = this.get_logger_repository();

      // data
      const env_data: DataConfigInfraestructureDto = this.get_data_config();
      const verb: string = app_state.get_verb();
      const transaction_id: string = app_state.get_transaction_id();


      // log entity
      let logger_entity = new LoggerEntity<IN,OUT,CATCH>(
        env_data.application_name,
        env_data.operation_connectivity,
      );
      logger_entity.set_verb(verb)
      logger_entity.set_transaction_id(transaction_id);
      logger_entity.set_layer(LayerNames.INFRAESTRUCTURE);
      logger_entity.set_request(object_contract);
      const init_time: number = new Date().getTime();
           
      try{
        // -------------------------
        // execute original method
        // -------------------------

        const result: Promise<OUT> = await original_method.apply(this, [
          timeout,
          oracle_connection,
          string_contract,
          object_contract
        ]);
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

        logger.write<IN,OUT,CATCH>(logger_entity);
        return result;
      }
      catch(err: any){

        // -------------------------
        // after error
        // -------------------------

        const end_time: number = new Date().getTime();

        logger_entity.set_type('error');
        logger_entity.set_message('error from oracle database');
        logger_entity.set_processing_time(end_time-init_time);
        logger_entity.set_time_stamp(tools.get_current_date());
        logger_entity.set_response(String(err));

        logger.write<IN,OUT,CATCH>(logger_entity);
        throw err;
      }
    };
  }
}
