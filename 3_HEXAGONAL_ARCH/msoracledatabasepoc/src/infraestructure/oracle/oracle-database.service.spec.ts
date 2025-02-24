import { GatewayTimeoutException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { OracleDatabaseStrategy } from "./oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import { FaultDto } from "../../share/exception/dtos/fault.dto";
import { tools } from "../../share/tools/tools";
import { LegacyNames } from "../../share/enums/legacy-names.enum";

@Injectable()
export class OracleDatabaseServiceSpec implements OracleDatabaseStrategy{
  
  execute_oracle_store_procedure(
    transaction_id: string,
    timeout: number,
    legacy: LegacyNames,
    oracle_connection: OracleConnectionDto, 
    string_contract: string, 
    object_contract: any
  ): Promise<unknown>{

    /**
     * 
     * Faults
     * 
     */

    if(object_contract['vciccid'] === '001'){
      const fault: FaultDto = tools.get_fault_CODE_001(
        'Oracle error', 
        transaction_id, 
        legacy,
      );
      throw new InternalServerErrorException(fault);
    }

    if(object_contract['vciccid'] === '002'){
      const fault: FaultDto = tools.get_fault_CODE_002(
        'Error: timeout', 
        transaction_id, 
        legacy
      );
      throw new GatewayTimeoutException(fault);
    }

    // bad gateway

    if(object_contract['vciccid'] === '003'){
      return Promise.resolve({
        vcmsisdd: null,
        vccodsaa: '-25',
        vcdessal: 'Error al registrar el usuario'
      });
    }

    /**
     * 
     * Cases
     * 
     */

    if(object_contract['vciccid'] === '1111'){
      return Promise.resolve({
        vcmsisdn: null,
        vccodsal: '-25',
        vcdessal: 'Error al registrar el usuario'
      });
    }

    /**
     * 
     * Default Success
     * 
     */
    return Promise.resolve({
      vcmsisdn: '3143982292',
      vccodsal: '1',
      vcdessal: 'Usuario registrado correctamente'
    });    
    
  }

}