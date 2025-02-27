import { Injectable } from "@nestjs/common";
import { OracleDatabaseStrategy } from "../strategy/oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";

@Injectable()
export class OracleDatabaseServiceSpec implements OracleDatabaseStrategy{
  
  execute_oracle_store_procedure(
    timeout: number,
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
      throw new Error('Oracle Database Error');
    }

    if(object_contract['vciccid'] === '002'){
      throw new Error('timeout');
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