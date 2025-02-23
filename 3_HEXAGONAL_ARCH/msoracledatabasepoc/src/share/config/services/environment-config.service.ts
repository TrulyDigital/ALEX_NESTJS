import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService{

  //
  private application_context: string;
  private application_name: string;
  private operation_controller: string;
  private operation_connectivity: string;
  private timeout: number;

  constructor(
    private readonly config_servie: ConfigService
  ){
    this.application_context = this.config_servie.get<string>('APPLICATION_CONTEXT') as string;
    this.application_name = this.config_servie.get<string>('APPLICATION_NAME') as string;
    this.operation_controller = this.config_servie.get<string>('APPLICATION_OPERATION_QUERY_PROPERTIES') as string;
    this.operation_connectivity = this.config_servie.get<string>('APPLICATION_OPERATION_LEGACY_1') as string;
    this.timeout = parseInt(this.config_servie.get<string>('APPLICATION_TIMEOUT') as string);
  }

  get_service(): EnvironmentConfigService{
    return this;
  }

  get_application_context(): string{
    return this.application_context;
  }

  get_application_name(): string{
    return this.application_name;
  }

  get_operation_controller(): string{
    return this.operation_controller;
  }

  get_operation_connectivity(): string{
    return this.operation_connectivity;
  }

  get_timeout(): number{
    return this.timeout;
  }
}