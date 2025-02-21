import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { InRegisterResourcesDto } from "../../application/dtos/in-register-resources.dto";
import { RegisterResourcesService } from "../../application/services/register-resources.service";
import { routes } from "../routes/routes";
import { OutRegisterResourcesDto } from "../../application/dtos/out-register-resources.dto";

@Controller(routes.APPLICATION_BASE_PATH)
export class RegisterResourcesController{

  constructor(
    private readonly register_resources: RegisterResourcesService,
  ){}

  @Post(routes.APPLICATION_OPERATION_QUERY_PROPERTIES)
  @HttpCode(200)
  async update_register_resources(
    @Body() body_in: InRegisterResourcesDto
  ): Promise<OutRegisterResourcesDto>{
    return await this.register_resources.update_register_resources(body_in);
  }
}