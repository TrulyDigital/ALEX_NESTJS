import { Injectable } from "@nestjs/common";
import { OracleDatabaseStrategy } from "../strategy/oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import * as oracledb from "oracledb";

@Injectable()
export class OracleDatabaseService implements OracleDatabaseStrategy{

  async execute_oracle_store_procedure(
    timeout: number,
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
      throw err;
    }
  }
}