import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService{

  //
  private application_context: string;
  private application_name: string;
  private operation_controller_1: string;
  private operation_connectivity_1: string;
  private operation_controller_2: string;
  private operation_connectivity_2: string;
  private timeout: number;

  constructor(
    private readonly config_servie: ConfigService
  ){
    this.application_context = this.config_servie.get<string>('APPLICATION_CONTEXT') as string;
    this.application_name = this.config_servie.get<string>('APPLICATION_NAME') as string;
    this.operation_controller_1 = this.config_servie.get<string>('APPLICATION_OPERATION_CONSULT_PLAN_DETAIL') as string;
    this.operation_connectivity_1 = this.config_servie.get<string>('APPLICATION_OPERATION_LEGACY_1') as string;
    this.operation_controller_2 = this.config_servie.get<string>('APPLICATION_OPERATION_CHANGE_PLAN_IOT') as string;
    this.operation_connectivity_2 = this.config_servie.get<string>('APPLICATION_OPERATION_LEGACY_2') as string;
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

  get_operation_controller_1(): string{
    return this.operation_controller_1;
  }

  get_operation_connectivity_1(): string{
    return this.operation_connectivity_1;
  }

  get_operation_controller_2(): string{
    return this.operation_controller_2;
  }

  get_operation_connectivity_2(): string{
    return this.operation_connectivity_2;
  }

  get_timeout(): number{
    return this.timeout;
  }
}