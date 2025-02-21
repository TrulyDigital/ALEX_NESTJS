import { Module } from "@nestjs/common";
import { RegisterResourcesService } from "./services/register-resources.service";
import { InfraestructureModule } from "../infraestructure/infraestructure.module";

@Module({
  imports: [ InfraestructureModule ],
  providers:[ RegisterResourcesService ],
  exports:[ RegisterResourcesService ],
})
export class ApplicationModule{}