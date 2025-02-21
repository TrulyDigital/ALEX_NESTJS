import { LegacyNames } from "../../share/enums/legacy-names.enum";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";

export interface OracleDatabaseStrategy{
  execute_oracle_store_procedure(
    transaction_id: string,
    timeout: number,
    legacy: LegacyNames,
    oracle_connection: OracleConnectionDto,
    string_contract: string,
    object_contract: any
  ): Promise<unknown>;
}