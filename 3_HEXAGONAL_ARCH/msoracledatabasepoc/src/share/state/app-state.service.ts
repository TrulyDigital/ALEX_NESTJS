import { Inject, Injectable } from "@nestjs/common";
import { DataConfigRepository } from "../config/repositories/data-config.repository";
import { DataConfigInfraestructureDto } from "../config/dtos/data-config-infraestructure.dto";
import { ApmSpanDto } from "../interceptors/dtos/apm-span.dto";


@Injectable()
export class AppStateService{

  // 
  private transaction_id: string;
  private verb: string;
  private validation_error_response: string | string[];
  private validation_error_request: string | string[];
  private data_config_infraestructure: DataConfigInfraestructureDto;
  private apm_span_data: Map<string, ApmSpanDto>;

  constructor(
    @Inject(DataConfigRepository) private readonly data_config: DataConfigRepository
  ){
    this.data_config_infraestructure = this.data_config.get_data_config_infraestructure();

    this.apm_span_data = new Map();
    this.apm_span_data.set(
      'execute_oracle_store_procedure',
      {
        span_name: this.data_config_infraestructure.database_procedure_path,
        span_type: 'Database',
        span_sub_type: 'Oracle',
        span_action: 'save'
      },
    );
    this.apm_span_data.set(
      'default',
      {
        span_name: this.data_config_infraestructure.database_procedure_path,
        span_type: 'Legacy',
        span_sub_type: 'Connectivity',
        span_action: 'call'
      },
    );
  }

  /**
   * 
   * Setters
   * 
   */

  set_transaction_id(
    transaction_id: string
  ): void{
    this.transaction_id = transaction_id;
  }

  set_verb(
    verb: string
  ): void{
    this.verb = verb;
  }

  set_validation_error_response(
    validation_error_response: string | string[]
  ): void{
    this.validation_error_response = validation_error_response;
  }

  set_validation_error_request(
    validation_error_request: string | string[]
  ): void{
    this.validation_error_request = validation_error_request;
  }

  /**
   * 
   * Getters
   * 
   */
  
  get_transaction_id(): string{
    return this.transaction_id;
  }

  get_verb(): string{
    return this.verb;
  }

  get_validation_error_response(): string | string[]{ 
    return this.validation_error_response;
  }

  get_validation_error_request(): string | string[]{
    return this.validation_error_request;
  }

  get_apm_span_data(
    query: string
  ): ApmSpanDto{
    const result: ApmSpanDto | undefined = this.apm_span_data.get(query);
    if(result !== undefined){
      return result;
    }
    else{
      return this.apm_span_data.get('default') as ApmSpanDto;;
    }
  }
  
}