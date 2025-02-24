import { Injectable } from "@nestjs/common";
import { CircuitBreakerConfigService } from "./circuit-breaker-config.service";
import { DatabaseConfigService } from "./database-config.service";
import { EnvironmentConfigService } from "./environment-config.service";
import { DataConfigInfraestructureDto } from "../dtos/data-config-infraestructure.dto";
import { DataConfigInterfaceDto } from "../dtos/data-config-interface.dto";
import { DataConfigRepository } from "../../../domain/repositories/data-config.repository";

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
      operation_connectivity: this.environment_config.get_operation_connectivity(),
      timeout: this.environment_config.get_timeout(),
      database_user: this.database_config.get_database_user(),
      database_pass: this.database_config.get_database_pass(),
      database_string: this.database_config.get_database_string(),
      database_procedure_path: this.database_config.get_database_procedure_path(),
    }
  }

  get_data_config_interface(): DataConfigInterfaceDto{
    return{
      application_name: this.environment_config.get_application_name(),
      operation_controller: this.environment_config.get_operation_controller(),
    }
  }
}