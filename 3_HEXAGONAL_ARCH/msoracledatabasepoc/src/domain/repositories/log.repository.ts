import { LogEntity } from "../entities/log.entity";

export const I_LOG_REPOSITORY = 'I_LOG_REPOSITORY';

export interface LogRepository{
  write<T1,T2>(log: LogEntity<T1,T2>): void
}