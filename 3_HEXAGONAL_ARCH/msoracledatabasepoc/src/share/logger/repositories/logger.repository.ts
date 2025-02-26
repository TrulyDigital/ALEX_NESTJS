import { LoggerEntity } from "../entities/logger.entity";

export const LoggerRepository = Symbol('LoggerRepository');

export interface LoggerRepository{

  write<IN,OUT,FAULT>(
    logger: LoggerEntity<IN,OUT,FAULT>
  ): void;
  
}