import { GatewayTimeoutException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { OracleDatabaseStrategy } from "./oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import { FaultDto } from "../../share/exception/dtos/fault.dto";
import { tools } from "../../share/tools/tools";
import { LegacyNames } from "../../share/enums/legacy-names.enum";
import * as oracledb from "oracledb";

@Injectable()
export class OracleDatabaseService implements OracleDatabaseStrategy{

  async execute_oracle_store_procedure(
    transaction_id: string, 
    timeout: number,
    legacy: LegacyNames,
    oracle_connection: OracleConnectionDto, 
    string_contract: string, 
    object_contract: any
  ): Promise<unknown>{ 

    let connection: oracledb.Connection;
    let result_query: oracledb.Result<any>;
    let oracle_response: Map<string, any>;
    
    try{
      connection = await Promise.race<oracledb.Connection>([
        oracledb.getConnection(oracle_connection),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
      ]);

      result_query = await connection.execute(
        string_contract,
        object_contract,
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      ); 
      
      oracle_response = new Map(Object.entries(result_query.outBinds));
      for(const [key, value] of oracle_response){
        if(typeof value === 'object' && value !== null){
          const newValue = value as oracledb.ResultSet<unknown>;
          oracle_response.set(key, await newValue.getRows()); // open ResultSet
          await newValue.close(); // close ResultSet
        }
      }
      
      const result: unknown = Object.fromEntries(oracle_response);
      return result;

    }
    catch(err: any){

      const err_timeout: boolean = String(err).includes('timeout'); 

      if(err_timeout){
        const fault: FaultDto = tools.get_fault_CODE_002(
          String(err), 
          transaction_id,
          legacy,
        );
        throw new GatewayTimeoutException(fault);
      }
      else{
        const fault: FaultDto = tools.get_fault_CODE_001(
          String(err), 
          transaction_id,
          legacy,
        );
        throw new InternalServerErrorException(fault);
      }
    }
  }

}