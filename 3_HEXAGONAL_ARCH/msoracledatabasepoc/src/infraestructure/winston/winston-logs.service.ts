import { LogEntity } from "../../domain/entities/log.entity";
import { LogRepository } from "../../domain/repositories/log.repository";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class WinstonLogsService implements LogRepository{

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winston
  ){}

  write<T1,T2>(log: LogEntity<T1, T2>): void {
    this.audit(log);
  }

  private audit<T1,T2>(
    log: LogEntity<T1,T2>
  ): void{

    const child_logger: any = this.winston.child(log);

    if(log.get_log().type === 'error'){
      child_logger.error(log.get_log().message);
    }

    if(log.get_log().type === 'info'){
      child_logger.info(log.get_log().message);
    }
  }
  
}