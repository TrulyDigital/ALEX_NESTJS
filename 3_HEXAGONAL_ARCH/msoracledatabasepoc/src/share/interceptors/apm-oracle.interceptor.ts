import { LegacyNames } from "../enums/legacy-names.enum";
import { OracleConnectionDto } from "../../infraestructure/dtos/oracle-connection.dto";
import { DataConfigInfraestructureDto } from "../dtos/data-config-infraestructure.dto";
import * as apm from 'elastic-apm-node';

export function ApmOracleInterceptor(): InterceptorType{
  return function(
    target: Object,
    property_key: string | symbol,
    descriptor: PropertyDescriptor,
  ): void{

    // get original method
    const original_method = descriptor.value;

    // overwrite method
    descriptor.value = async function (
      transaction_id: string,
      timeout: string,
      legacy: LegacyNames,
      oracle_connection: OracleConnectionDto,
      string_contract: string,
      object_contract: any
    ): Promise<unknown> {

      // -------------------------
      // before
      // -------------------------

      // data
      const env_data: DataConfigInfraestructureDto = this.get_data_config();
      
      // apm
      const init_time: number = new Date().getTime();
      let apm_span: apm.Span | null = apm.startSpan(
        `${env_data.database_procedure_path}`,
        'Database',
        'Oracle',
        'find',
      );
      
      try{

        // -------------------------
        // execute original method
        // -------------------------

        const result: Promise<any> = await original_method.apply(this, [
          transaction_id,
          timeout,
          legacy,
          oracle_connection,
          string_contract,
          object_contract
        ]);
        const end_time: number = new Date().getTime();

        // -------------------------
        // after success
        // -------------------------
        
        // apm must be initialized in the main file
        if(apm_span){
          apm_span.setLabel('processingTime', `${end_time-init_time}`);
          apm_span.end();
        }
        
        return result;
      }
      finally{
        if(apm_span){
          const end_time: number = new Date().getTime();
          apm_span.setLabel('processingTime', `${end_time-init_time}`);
          apm_span.end();
        }
      }  
    };
  }
}