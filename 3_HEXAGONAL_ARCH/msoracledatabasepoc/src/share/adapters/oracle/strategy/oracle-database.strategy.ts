import { OracleConnectionDto } from "../dtos/oracle-connection.dto";

export interface OracleDatabaseStrategy{
  execute_oracle_store_procedure(
    timeout: number,
    oracle_connection: OracleConnectionDto,
    string_contract: string,
    object_contract: any,
  ): Promise<unknown>;
}