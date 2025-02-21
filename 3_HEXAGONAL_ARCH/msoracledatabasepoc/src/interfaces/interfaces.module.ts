import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RegisterResourcesController } from "./controllers/register-resources.controller";
import { ApplicationModule } from "../application/application.module";
import { MiddlewareService } from "./middlewares/middleware.service";

@Module({
  imports: [
    ApplicationModule,
  ],
  providers: [
    MiddlewareService,
  ],
  exports: [
    MiddlewareService,
  ],
  controllers:[
    RegisterResourcesController,
  ]
})
export class InterfacesModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareService)
      .forRoutes('*');
  }
}