import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { InfraestructureModule } from './infraestructure/infraestructure.module';
import { InterfacesModule } from './interfaces/interfaces.module';
import { ConfigModule } from '@nestjs/config'; 
import { WinstonModule } from 'nest-winston';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as winston from "winston";
import { ShareModule } from './share/share.module';
import { HttpExceptionFilter } from './share/exception/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';

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
                'src/infraestructure/config', 
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
                  'src/infraestructure/config',
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
                  'src/infraestructure/config',
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
                  'src/infraestructure/config',
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
                  'src/infraestructure/config',
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

    // logs & audit
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({ format: winston.format.json() })
      ]
    }),

    ShareModule,
    ApplicationModule,
    InfraestructureModule,
    InterfacesModule,
  ],

  providers:[
    {
      useClass: HttpExceptionFilter,
      provide: APP_FILTER,
    }
  ],

})
export class AppModule {}
