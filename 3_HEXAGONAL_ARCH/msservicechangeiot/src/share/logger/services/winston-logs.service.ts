import { LoggerEntity } from "../entities/logger.entity";
import { LoggerRepository } from "../repositories/logger.repository";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class WinstonLoggerService implements LoggerRepository{

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winston
  ){}

  write<T1,T2,F>(logger: LoggerEntity<T1,T2,F>): void {
    this.audit(logger);
  }

  private audit<T1,T2,F>(
    logger: LoggerEntity<T1,T2,F>
  ): void{

    const { type, ...new_logger } = logger.get_logger_object();

    const child_logger: any = this.winston.child(new_logger);

    if(type === 'error'){
      child_logger.error(logger.get_logger_object().message);
    }

    if(type === 'info'){
      child_logger.info(logger.get_logger_object().message);
    }
  }
}