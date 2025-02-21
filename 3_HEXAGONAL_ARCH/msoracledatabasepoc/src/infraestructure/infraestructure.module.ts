import { Module } from "@nestjs/common";
import { CircuitBreakerConfigService } from "./config/circuit-breaker-config.service";
import { DatabaseConfigService } from "./config/database-config.service";
import { EnvironmentConfigService } from "./config/environment-config.service";
import { OracleDatabaseService } from "./oracle/oracle-database.service";
import { PrcRegistraUsuariosService } from "./database/prc-registra-usuarios.service";
import { I_REGISTER_RESOURCES_REPOSITORY } from "../domain/repositories/register-resources.repository";
import { ConfigService } from "@nestjs/config";
import { WinstonLogsService } from "./winston/winston-logs.service";
import { I_LOG_REPOSITORY } from "../domain/repositories/log.repository";

@Module({
  providers: [
    ConfigService,
    CircuitBreakerConfigService,
    DatabaseConfigService,
    EnvironmentConfigService,
    OracleDatabaseService,
    {
      useClass: PrcRegistraUsuariosService,
      provide: I_REGISTER_RESOURCES_REPOSITORY,
    },
    {
      useClass: WinstonLogsService,
      provide: I_LOG_REPOSITORY,
    },
    
  ],
  exports: [
    {
      useClass: PrcRegistraUsuariosService,
      provide: I_REGISTER_RESOURCES_REPOSITORY,
    },
    {
      useClass: WinstonLogsService,
      provide: I_LOG_REPOSITORY,
    }
  ]
})
export class InfraestructureModule{}