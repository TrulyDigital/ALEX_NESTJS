import { BadGatewayException, GatewayTimeoutException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { RegisterResourcesInEntity } from "../../../domain/entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../../../domain/entities/register-resources-out.entity";
import { RegisterResourcesRepository } from "../../../domain/repositories/register-resources.repository";
import { OracleDatabaseStrategy } from "../../../share/adapters/oracle/strategy/oracle-database.strategy";
import { OracleConnectionDto } from "../../../share/adapters/oracle/dtos/oracle-connection.dto";
import { OracleDatabaseService } from "../../../share/adapters/oracle/services/oracle-database.service";
import { OutPrcRegistraUsuariosDto } from "../dtos/out-prc-registra-usuarios.dto";
import { OracleDatabaseServiceSpec } from "../../../share/adapters/oracle/services/oracle-database.service.spec";
import { OracleLogger } from "../../../share/interceptors/decorators/oracle-logger.decorator";
import { AppStateService } from "../../../share/state/app-state.service";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { tools } from "../../../share/tools/tools";
import { FaultDto } from "../../../share/exception/dtos/fault.dto";
import { ErrorHttpDescriptions, ErrorHttpMessagesInfraestructure } from "../../../share/enums/error-codes-and-messages.enum";
import { ApmAgent } from "../../../share/interceptors/decorators/apm-agent.decorator";
import { DataConfigRepository } from "../../../share/config/repositories/data-config.repository";
import { DataConfigInfraestructureDto } from "../../../share/config/dtos/data-config-infraestructure.dto";
import { ErrorHttpCodes } from "../../../share/enums/error-codes-and-messages.enum";
import * as oracledb from 'oracledb';

type IN = any;
type OUT = OutPrcRegistraUsuariosDto;
type CATCH = string;

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
    @Inject(DataConfigRepository) private readonly data_config: DataConfigRepository,
  ){
    this.config = this.data_config.get_data_config_infraestructure();
    this.timeout = this.config.timeout;
    this.database_procedure_path = this.config.database_procedure_path;

    const context: string = this.config.application_context;
    if(context.toLowerCase() === 'test') this.db = new OracleDatabaseServiceSpec();
    else this.db = new OracleDatabaseService();
  }
  

  /**
   * 
   * @description
   * 
   * Strategy Implementation
   * 
   */

  @ApmAgent()
  @OracleLogger<IN,OUT,CATCH>()
  async execute_oracle_store_procedure(
    timeout: number,
    oracle_connection: OracleConnectionDto, 
    string_contract: string, 
    object_contract: any
  ): Promise<unknown> {

    const result: unknown = await this.db.execute_oracle_store_procedure(
      timeout,
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
    let result: unknown;

    try{
      result = await this.execute_oracle_store_procedure(
        this.timeout,
        this.get_oracle_connection(),
        this.get_string_contract(),
        this.get_object_contract(register_resources_in),
      );
    }
    // [ERROR] from database
    catch(err: any){
      this.app_state.set_validation_error_response(String(err));
      const err_timeout: boolean = String(err).includes('timeout');
      if(err_timeout){
        const fault: FaultDto = {
          transaction_id: this.transaction_id,
          status_code: ErrorHttpCodes.HTTP_504_CODE,
          error: ErrorHttpDescriptions.HTTP_504_DESC,
          message: ErrorHttpMessagesInfraestructure.HTTP_504_MSG_1,
        }
        throw new GatewayTimeoutException(fault);
      }
      else{
        const fault: FaultDto = {
          transaction_id: this.transaction_id,
          status_code: ErrorHttpCodes.HTTP_500_CODE,
          error: ErrorHttpDescriptions.HTTP_500_DESC,
          message: ErrorHttpMessagesInfraestructure.HTTP_500_MSG_1,
        }
        throw new InternalServerErrorException(fault);
      }
    }

    // response validation

    const result_validated: OutPrcRegistraUsuariosDto = plainToInstance(
      OutPrcRegistraUsuariosDto,
      result
    );

    // are there any error ?

    const validation_error: ValidationError[] = await validate(result_validated);
    
    if(validation_error.length > 0){

      let description_errors: string[] = tools.get_description_errors_after_validation(
        validation_error
      );
      this.app_state.set_validation_error_response(description_errors);

      const fault: FaultDto = {
        transaction_id: this.transaction_id,
        status_code: ErrorHttpCodes.HTTP_502_CODE,
        error: ErrorHttpDescriptions.HTTP_502_DESC,
        message: ErrorHttpMessagesInfraestructure.HTTP_502_MSG_1,
      }
      throw new BadGatewayException(fault);
    }

    // success response

    const register_resources_out = new RegisterResourcesOutEntity();
    register_resources_out.set_mobile_number(result_validated.vcmsisdn); 
    register_resources_out.set_output_code(result_validated.vccodsal);
    register_resources_out.set_output_description(result_validated.vcdessal);
    register_resources_out.set_transaction_id(this.transaction_id);

    // result

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