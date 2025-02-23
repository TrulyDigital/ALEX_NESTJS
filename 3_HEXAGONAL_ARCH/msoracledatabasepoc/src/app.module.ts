import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from './share/exception/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { RegisterResourcesRepository } from './domain/repositories/register-resources.repository';
import { PrcRegistraUsuariosService } from './infraestructure/database/prc-registra-usuarios.service';
import { OracleDatabaseService } from './infraestructure/oracle/oracle-database.service';
import { OracleDatabaseServiceSpec } from './infraestructure/oracle/oracle-database.service.spec';
import { RegisterResourcesService } from './application/services/register-resources.service';
import { CircuitBreakerConfigService } from './share/config/services/circuit-breaker-config.service';
import { DatabaseConfigService } from './share/config/services/database-config.service';
import { EnvironmentConfigService } from './share/config/services/environment-config.service';
import { AllConfigService } from './share/config/services/all-config.service';
import { AppStateService } from './share/services/app-state.service';
import { WinstonLoggerService } from './share/winston/winston-logs.service';
import { LoggerRepository } from './domain/repositories/logger.repository';
import { DataConfigRepository } from './domain/repositories/data-config.repository';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as winston from "winston";
import { MiddlewareService } from './interfaces/middlewares/middleware.service';
import { RegisterResourcesController } from './interfaces/controllers/register-resources.controller';

@Module({

  imports: [

    // load envinronmet data 
    ConfigModule.forRoot({
      load: [
        () => {

          // get conext
          const env_context = dotenv.config(
            { 
              path: path.resolve(
                __dirname, 
                '..', 
                'src/share/config/env', 
                '.env.context'
              ) 
            }
          ).parsed;
          
          let env_config_file: dotenv.DotenvParseOutput | undefined;

          // load .env.main
          if(
            env_context !== undefined &&
            (
              env_context.APPLICATION_CONTEXT.toUpperCase() === 'dev' ||
              env_context.APPLICATION_CONTEXT.toUpperCase() === 'qa'  ||
              env_context.APPLICATION_CONTEXT.toUpperCase() === 'prod'
            )
          ){
            env_config_file = dotenv.config(
              {
                path: path.resolve(
                  __dirname,
                  '..',
                  'src/share/config/env',
                  '.env.main'
                )
              }
            ).parsed;
          }

          // load .env.local
          if(
            env_context !== undefined &&
            (
              env_context.APPLICATION_CONTEXT.toUpperCase() === 'local'
            )
          ){
            env_config_file = dotenv.config(
              {
                path: path.resolve(
                  __dirname,
                  '..',
                  'src/share/config/env',
                  '.env.local'
                )
              }
            ).parsed;
          }

          // load .env.test
          if(
            env_context !== undefined &&
            (
              env_context.APPLICATION_CONTEXT.toUpperCase() === 'test'
            )
          ){
            env_config_file = dotenv.config(
              {
                path: path.resolve(
                  __dirname,
                  '..',
                  'src/share/config/env',
                  '.env.test'
                )
              }
            ).parsed;
          }

          // default
          if(
            env_context !== undefined &&
            (
              env_context.APPLICATION_CONTEXT.toUpperCase() !== 'dev' &&
              env_context.APPLICATION_CONTEXT.toUpperCase() !== 'qa'  &&
              env_context.APPLICATION_CONTEXT.toUpperCase() !== 'prod' &&
              env_context.APPLICATION_CONTEXT.toUpperCase() !== 'local' &&
              env_context.APPLICATION_CONTEXT.toUpperCase() !== 'test'
            )
          ){
            env_config_file = dotenv.config(
              {
                path: path.resolve(
                  __dirname,
                  '..',
                  'src/share/config/env',
                  '.env.local'
                )
              }
            ).parsed;
          }

          // load root env file
          const root_config = dotenv.config(
            {
              path: path.resolve(
                __dirname,
                '..',
                '.env'
              )
            }
          ).parsed;

          return {
            ...root_config,
            ...env_context,
            ...env_config_file,
          }
        }
      ]
    }),

    // logger & audit
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({ format: winston.format.json() })
      ]
    }),

  ],

  providers:[

    // infraestructure
    {
      useClass: PrcRegistraUsuariosService,
      provide: RegisterResourcesRepository,
    },
    OracleDatabaseService,
    OracleDatabaseServiceSpec,

    // application
    RegisterResourcesService,

    // share
    AppStateService,
    CircuitBreakerConfigService,
    DatabaseConfigService,
    EnvironmentConfigService,
    {
      useClass: AllConfigService,
      provide: DataConfigRepository,
    },
    {
      useClass: WinstonLoggerService,
      provide: LoggerRepository,
    },
    {
      useClass: HttpExceptionFilter,
      provide: APP_FILTER,
    },
  ],

  controllers:[
    RegisterResourcesController,
  ]

})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareService)
      .forRoutes('*');
  }
}
