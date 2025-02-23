import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import { InRegisterResourcesDto } from "../../application/dtos/in-register-resources.dto";
import { RegisterResourcesService } from "../../application/services/register-resources.service";
import { routes } from "../routes/routes";
import { OutRegisterResourcesDto } from "../../application/dtos/out-register-resources.dto";
import { LoggerControllerInterceptor } from "../interceptors/logger-controller.interceptor";
import { AppStateService } from "../../share/services/app-state.service";
import { LoggerRepository } from "../../domain/repositories/logger.repository";
import { FaultDto } from "../../share/dtos/fault.dto";
import { DataConfigRepository } from "../../domain/repositories/data-config.repository";
import { DataConfigInterfaceDto } from "../../share/dtos/data-config-interface.dto";

type IN = InRegisterResourcesDto;
type OUT = OutRegisterResourcesDto;
type FAULT = FaultDto;

@Controller(routes.APPLICATION_BASE_PATH)
export class RegisterResourcesController{

  constructor(
    private readonly app_state: AppStateService,
    private readonly register_resources: RegisterResourcesService,
    @Inject(LoggerRepository) readonly winston: LoggerRepository,
    @Inject(DataConfigRepository) readonly env_data: DataConfigRepository,
  ){}

  /**
   * 
   * Opertations
   * 
   */

  @Post(routes.APPLICATION_OPERATION_REGISTER_RESOURCES)
  @HttpCode(200)
  @LoggerControllerInterceptor<IN,OUT,FAULT>()
  async update_register_resources(
    @Body() body_in: InRegisterResourcesDto
  ): Promise<OutRegisterResourcesDto>{
    return await this.register_resources.update_register_resources(body_in);
  }


   /**
   * 
   * Method Class
   * 
   */

  get_app_state(): AppStateService{
    return this.app_state;
  }

  get_data_config(): DataConfigInterfaceDto{
    return this.env_data.get_data_config_interface();
  }

  get_logger_repository(): LoggerRepository{
    return this.winston;
  }

}