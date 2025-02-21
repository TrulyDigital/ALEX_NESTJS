import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { RegisterResourcesInEntity } from "../../domain/entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../../domain/entities/register-resources-out.entity";
import { RegisterResourcesRepository } from "../../domain/repositories/register-resources.repository";
import { OracleDatabaseStrategy } from "../oracle/oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import { EnvironmentConfigService } from "../config/environment-config.service";
import { OracleDatabaseService } from "../oracle/oracle-database.service";
import { DatabaseConfigService } from "../config/database-config.service";
import { OutPrcRegistraUsuariosDto } from "../dtos/out-prc-registra-usuarios.dto";
import { OracleDatabaseServiceSpec } from "../oracle/oracle-database.service.spec";
import { OracleDatabaseInterceptor } from "../interceptors/oracle-database.interceptor";
import { AppStateService } from "../../share/services/app-state.service";
import { I_LOG_REPOSITORY, LogRepository } from "../../domain/repositories/log.repository";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { tools } from "../../share/tools/tools";
import { FaultDto } from "../../share/dtos/fault.dto";
import { ErrorCodes, ErrorMessages } from "../../share/enums/error-codes.enum";
import { LegacyNames } from "../../share/enums/legacy-names.enum";
import * as oracledb from 'oracledb';

type IN = any;
type OUT = OutPrcRegistraUsuariosDto;

@Injectable()
export class PrcRegistraUsuariosService implements RegisterResourcesRepository, OracleDatabaseStrategy{

  // variables of the class
  private db: OracleDatabaseStrategy;
  private database_procedure_path: string;
  private application_name: string;
  private method_name: string;
  private timeout: number;
  private verb: string;
  private transaction_id: string;

  // constructor
  constructor(
    private readonly environment_config: EnvironmentConfigService,
    private readonly app_state: AppStateService,
    private readonly database_config: DatabaseConfigService,
    @Inject(I_LOG_REPOSITORY) private readonly winston: LogRepository
  ){

    this.application_name = this.environment_config.get_application_name();
    this.method_name = this.environment_config.get_operation_connectivity();
    this.timeout = this.environment_config.get_timeout();
    this.verb = 'POST';
    this.database_procedure_path = this.database_config.get_database_procedure_path();

    const context: string = this.environment_config.get_application_context();
    if(context.toLowerCase() === 'test') this.db = new OracleDatabaseServiceSpec();
    else this.db = new OracleDatabaseService();
  }

  /**
   * 
   * Getters
   * 
   */

  get_application_name(): string{
    return this.application_name;
  }

  get_method_name(): string{
    return this.method_name;
  }

  get_verb(): string{
    return this.verb;
  }

  get_log_repository(): LogRepository{
    return this.winston;
  }


  /**
   * 
   * @description
   * 
   * Strategy Implementation
   * 
   */

  @OracleDatabaseInterceptor<IN,OUT>
  async execute_oracle_store_procedure(
    transaction_id: string,
    timeout: number,
    legacy: LegacyNames,
    oracle_connection: OracleConnectionDto, 
    string_contract: string, 
    object_contract: any
  ): Promise<unknown> {

    const result: unknown = await this.db.execute_oracle_store_procedure(
      transaction_id,
      timeout,
      legacy,
      oracle_connection,
      string_contract,
      object_contract
    );

    return result;
  }


  /**
   * 
   * @description
   * 
   * Repository Implementation
   * 
   */
  
  async update_one(
    register_resources_in: RegisterResourcesInEntity
  ): Promise<RegisterResourcesOutEntity> { 

    this.transaction_id = this.app_state.get_transaction_id();

    const result: unknown = await this.execute_oracle_store_procedure(
      this.transaction_id,
      this.timeout,
      LegacyNames.LEGACY_BSCS,
      this.get_oracle_connection(),
      this.get_string_contract(),
      this.get_object_contract(register_resources_in)
    );

    const result_validated: OutPrcRegistraUsuariosDto = plainToInstance(
      OutPrcRegistraUsuariosDto,
      result
    );

    const validation_error: ValidationError[] = await validate(result_validated);
    
    if(validation_error.length > 0){

      let description_errors: string[] = tools.get_description_errors_after_validation(
        validation_error
      );

      const fault: FaultDto = {
        transaction_id: this.transaction_id,
        status_code: 502,
        message: 'Bad Gateway',
        error: {
          code: ErrorCodes.CODE_003,
          message: ErrorMessages.MSG_003,
          legacy: LegacyNames.LEGACY_BSCS,
          date_time: tools.get_current_date(),
          description: description_errors
        }
      }
      throw new BadGatewayException(fault);
    }

    const register_resources_out = new RegisterResourcesOutEntity();
    register_resources_out.set_mobile_number(result_validated.vcmsisdn); 
    register_resources_out.set_output_code(result_validated.vccodsal);
    register_resources_out.set_output_description(result_validated.vcdessal);
    register_resources_out.set_transaction_id(this.transaction_id);

    return register_resources_out;
  } 


  /**
   * 
   * @description
   * 
   * Class methods 
   * 
   */

  private get_string_contract(): string{
    return `BEGIN ${this.database_procedure_path}(
        :vciccid,
        :vcproviderid,
        :vcenterpriceid,
        :vceid,
        :vcimei,
        :vcplanid,
        :vclocation,
        :vcmsisdn,
        :vccodsal,
        :vcdessal
      ); END;
    `;
  }

  private get_object_contract(
    register_resources: RegisterResourcesInEntity
  ){
    return{
      vciccid: register_resources.get_iccid(),
      vcproviderid: register_resources.get_provider_id(),
      vcenterpriceid: register_resources.get_provider_id(),
      vceid: register_resources.get_eid(),
      vcimei: register_resources.get_imei(),
      vcplanid: register_resources.get_plan_id(),
      vclocation: register_resources.get_location(),
      vcmsisdn: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING
      },
      vccodsal: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING
      },
      vcdessal: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING
      }
    }
  }

  get_oracle_connection(): OracleConnectionDto{
    return {
      user: this.database_config.get_database_user(),
      password: this.database_config.get_database_pass(),
      connectString: this.database_config.get_database_string()
    }
  }
  
}