import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { InRegisterResourcesDto } from "../../application/dtos/in-register-resources.dto";
import { RegisterResourcesService } from "../../application/services/register-resources.service";
import { routes } from "../routes/routes";
import { OutRegisterResourcesDto } from "../../application/dtos/out-register-resources.dto";
import { LoggerController } from "../../share/interceptors/decorators/logger-controller.decorator";
import { FaultDto } from "../../share/exception/dtos/fault.dto";

type IN = InRegisterResourcesDto;
type OUT = OutRegisterResourcesDto;
type FAULT = FaultDto;

@Controller(routes.APPLICATION_BASE_PATH)
export class RegisterResourcesController{

  constructor(
    private readonly register_resources: RegisterResourcesService,
  ){}

  /**
   * 
   * Opertations
   * 
   */

  @Post(routes.APPLICATION_OPERATION_REGISTER_RESOURCES)
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @LoggerController<IN,OUT,FAULT>()
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

  get_register_resources_service(): RegisterResourcesService{
    return this.register_resources;
  }

}