import { Global, Module } from "@nestjs/common";
import { AppStateService } from "./services/app-state.service";

@Global()
@Module({
  providers:[
    AppStateService,
  ],
  exports: [
    AppStateService,
  ]
})
export class ShareModule{}