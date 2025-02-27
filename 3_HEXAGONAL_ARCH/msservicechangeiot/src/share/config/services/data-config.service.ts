import { Injectable } from "@nestjs/common";
import { CircuitBreakerConfigService } from "./circuit-breaker-config.service";
import { DatabaseConfigService } from "./database-config.service";
import { EnvironmentConfigService } from "./environment-config.service";
import { DataConfigInfraestructureDto } from "../dtos/data-config-infraestructure.dto";
import { DataConfigInterfaceDto } from "../dtos/data-config-interface.dto";
import { DataConfigRepository } from "../repositories/data-config.repository";

@Injectable()
export class DataConfigService implements DataConfigRepository{

  constructor(
    private readonly circuit_breaker_config: CircuitBreakerConfigService,
    private readonly database_config: DatabaseConfigService,
    private readonly environment_config: EnvironmentConfigService,
  ){}

  get_data_config_infraestructure(): DataConfigInfraestructureDto{
    return{
      application_context: this.environment_config.get_application_context(),
      application_name: this.environment_config.get_application_name(),
      operation_connectivity: this.environment_config.get_operation_connectivity_1(),
      timeout: this.environment_config.get_timeout(),
      database_user_1: this.database_config.get_database_user_1(),
      database_pass_1: this.database_config.get_database_pass_1(),
      database_string_1: this.database_config.get_database_string_1(),
      database_procedure_path_1: this.database_config.get_database_procedure_path_1(),
      database_user_2: this.database_config.get_database_user_2(),
      database_pass_2: this.database_config.get_database_pass_2(),
      database_string_2: this.database_config.get_database_string_2(),
      database_procedure_path_2: this.database_config.get_database_procedure_path_2(),
    }
  }

  get_data_config_interface(): DataConfigInterfaceDto{
    return{
      application_name: this.environment_config.get_application_name(),
      operation_controller_1: this.environment_config.get_operation_controller_1(),
      operation_controller_2: this.environment_config.get_operation_controller_2(),
    }
  }
}