import { Inject, Injectable } from "@nestjs/common";
import { RegisterResourcesRepository } from "../../domain/repositories/register-resources.repository";
import { InRegisterResourcesDto } from "../dtos/in-register-resources.dto";
import { RegisterResourcesInEntity } from "../../domain/entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../../domain/entities/register-resources-out.entity";
import { OutRegisterResourcesDto } from "../dtos/out-register-resources.dto";
import { LoggerRepository } from "../../share/logger/repositories/logger.repository";
import { DataConfigRepository } from "../../share/config/repositories/data-config.repository";
import { DataConfigInterfaceDto } from "../../share/config/dtos/data-config-interface.dto";
import { AppStateService } from "../../share/state/app-state.service";

@Injectable()
export class RegisterResourcesService{

  private register_resources_in: RegisterResourcesInEntity;
  private register_resources_out: RegisterResourcesOutEntity;

  constructor(
    private readonly app_state: AppStateService,
    @Inject(LoggerRepository) private readonly  winston: LoggerRepository,
    @Inject(DataConfigRepository) private readonly env_data: DataConfigRepository,
    @Inject(RegisterResourcesRepository) private readonly db: RegisterResourcesRepository
  ){}

  async update_register_resources(
    body_in: InRegisterResourcesDto
  ): Promise<OutRegisterResourcesDto>{

    this.register_resources_in = new RegisterResourcesInEntity(
      body_in.iccid,
      body_in.provider_id,
      body_in.enterprise_id,
      body_in.eid,
      body_in.imei,
      body_in.plan_id,
      body_in.location,
    );

    this.register_resources_out = await this.db.update_one(this.register_resources_in);
    const body_out: OutRegisterResourcesDto = {
      transaction_id: this.register_resources_out.get_transaction_id(),
      status_code: 200,
      message: 'success',
      data: {
        output_code: this.register_resources_out.get_output_code(),
        output_description: this.register_resources_out.get_output_description(),
        mobile_number: this.register_resources_out.get_mobile_number(),
      }
    };

    return body_out;
  }

  get_data_config(): DataConfigInterfaceDto{
    return this.env_data.get_data_config_interface();
  }

  get_logger_repository(): LoggerRepository{
    return this.winston;
  }

  get_app_state(): AppStateService{
    return this.app_state;
  }

}