
import { LogEntity } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repositories/log.repository";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import { tools } from "../../share/tools/tools";
import { LegacyNames } from "../../share/enums/legacy-names.enum";

export function OracleDatabaseInterceptor<T1,T2>(
  target: Object,
  property_key: string | symbol, // method name or class name, it depends on the execution context
  descriptor: PropertyDescriptor // implementation of the method
): void | PropertyDescriptor{

  // get original implementation of the method
  const original_method = descriptor.value;
    
  // overwrite original method. this must be like this
  descriptor.value = async function (
    transaction_id: string,
    timeout: string,
    legacy: LegacyNames,
    oracle_connection: OracleConnectionDto,
    string_contract: string,
    object_contract: any
  ): Promise<any> {

    // before

    let log_entity = new LogEntity<T1,T2>(
      this.get_application_name(),
      this.get_method_name()
    );
    log_entity.set_verb(this.get_verb())
    log_entity.set_transaction_id(transaction_id);
    log_entity.set_layer('Infraestructure');
    log_entity.set_request(object_contract);
    const init_time: number = new Date().getTime();
    
    // execution of the original method
    
    try{
      const result: Promise<T2> = await original_method.apply(this, [
        transaction_id,
        timeout,
        legacy,
        oracle_connection,
        string_contract,
        object_contract
      ]);
      const end_time: number = new Date().getTime(); 

      // after

      const method_result = await result;
      log_entity.set_type('info');
      log_entity.set_message('success');
      log_entity.set_processing_time(end_time - init_time);
      log_entity.set_time_stamp(tools.get_current_date());
      log_entity.set_response(method_result);

      let log: LogRepository = this.get_log_repository();
      log.write<T1,T2>(log_entity);

      return result;
    }
    catch(err: any){

      const end_time: number = new Date().getTime();

      log_entity.set_type('error');
      log_entity.set_message('error from oracle database');
      log_entity.set_processing_time(end_time - init_time);
      log_entity.set_time_stamp(tools.get_current_date());
      log_entity.set_response(String(err));

      let log: LogRepository = this.get_log_repository();
      log.write<T1,T2>(log_entity);

      // error fault already exists here
      throw err;
    }

    
  };
}
