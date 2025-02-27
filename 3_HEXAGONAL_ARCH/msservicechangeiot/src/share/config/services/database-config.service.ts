import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService{
  
  // procedure 1
  private database_user_1: string;
  private database_pass_1: string;
  private database_procedure_path_1: string;
  private database_string_1: string;
  // procedure 2
  private database_user_2: string;
  private database_pass_2: string;
  private database_procedure_path_2: string;
  private database_string_2: string;

  //
  constructor(
    private readonly config_service: ConfigService
  ){
    // procedure 1
    this.database_user_1 = this.config_service.get<string>('DATABASE_USER_1') as string;
    this.database_pass_1 = this.config_service.get<string>('DATABASE_PASS_1') as string;
    this.database_procedure_path_1 = this.config_service.get<string>('DATABASE_PROCEDURE_PATH_1') as string;
    this.database_string_1 = this.config_service.get<string>('DATABASE_STRING_1') as string;
    // procedure 2
    this.database_user_2 = this.config_service.get<string>('DATABASE_USER_2') as string;
    this.database_pass_2 = this.config_service.get<string>('DATABASE_PASS_2') as string;
    this.database_procedure_path_2 = this.config_service.get<string>('DATABASE_PROCEDURE_PATH_2') as string;
    this.database_string_2 = this.config_service.get<string>('DATABASE_STRING_2') as string;
  }

  get_database_user_1(): string{
    return this.database_user_1;
  }

  get_database_pass_1(): string{
    return this.database_pass_1;
  }

  get_database_procedure_path_1(): string{
    return this.database_procedure_path_1;
  }

  get_database_string_1(): string{
    return this.database_string_1;
  }

  get_database_user_2(): string{
    return this.database_user_2;
  }

  get_database_pass_2(): string{
    return this.database_pass_2;
  }

  get_database_procedure_path_2(): string{
    return this.database_procedure_path_2;
  }

  get_database_string_2(): string{
    return this.database_string_2;
  }

}