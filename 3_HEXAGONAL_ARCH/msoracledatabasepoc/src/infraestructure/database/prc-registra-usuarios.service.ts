import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { RegisterResourcesInEntity } from "../../domain/entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../../domain/entities/register-resources-out.entity";
import { RegisterResourcesRepository } from "../../domain/repositories/register-resources.repository";
import { OracleDatabaseStrategy } from "../oracle/oracle-database.strategy";
import { OracleConnectionDto } from "../dtos/oracle-connection.dto";
import { OracleDatabaseService } from "../oracle/oracle-database.service";
import { OutPrcRegistraUsuariosDto } from "../dtos/out-prc-registra-usuarios.dto";
import { OracleDatabaseServiceSpec } from "../oracle/oracle-database.service.spec";
import { LoggerOracleInterceptor } from "../../share/interceptors/decorators/logger-oracle.interceptor";
import { AppStateService } from "../../share/state/app-state.service";
import { LoggerRepository } from "../../domain/repositories/logger.repository";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { tools } from "../../share/tools/tools";
import { FaultDto } from "../../share/exception/dtos/fault.dto";
import { ErrorCodes, ErrorMessages } from "../../share/enums/error-codes-and-messages.enum";
import { LegacyNames } from "../../share/enums/legacy-names.enum";
import { ApmOracleInterceptor } from "../../share/interceptors/decorators/apm-oracle.interceptor";
import { DataConfigRepository } from "../../domain/repositories/data-config.repository";
import { DataConfigInfraestructureDto } from "../../share/config/dtos/data-config-infraestructure.dto";
import * as oracledb from 'oracledb';

type IN = any;
type OUT = OutPrcRegistraUsuariosDto;
type FAULT = FaultDto;

@Injectable()
export class PrcRegistraUsuariosService implements RegisterResourcesRepository, OracleDatabaseStrategy{

  // variables of the class
  private db: OracleDatabaseStrategy;
  private database_procedure_path: string;
  private timeout: number;
  private transaction_id: string;
  private config: DataConfigInfraestructureDto;

  // constructor
  constructor(
    private readonly app_state: AppStateService,
    @Inject(DataConfigRepository) private readonly env_data: DataConfigRepository,
    @Inject(LoggerRepository) private readonly winston: LoggerRepository
  ){
    this.config = this.env_data.get_data_config_infraestructure();
    this.timeout = this.config.timeout;
    this.database_procedure_path = this.config.database_procedure_path;

    const context: string = this.config.application_context;
    if(context.toLowerCase() === 'test') this.db = new OracleDatabaseServiceSpec();
    else this.db = new OracleDatabaseService();
  }

  /**
   * 
   * Getters 
   * 
   */

  get_app_state(): AppStateService{
    return this.app_state;
  }

  get_data_config(): DataConfigInfraestructureDto{
    return this.env_data.get_data_config_infraestructure();
  }

  get_logger_repository(): LoggerRepository{
    return this.winston;
  }


  /**
   * 
   * @description
   * 
   * Strategy Implementation
   * 
   */

  @ApmOracleInterceptor()
  @LoggerOracleInterceptor<IN,OUT,FAULT>()
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
          code: ErrorCodes.ERR_001,
          message: ErrorMessages.MSG_001_3,
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
      user: this.config.database_user,
      password: this.config.database_pass,
      connectString: this.config.database_string,
    }
  }
  
}