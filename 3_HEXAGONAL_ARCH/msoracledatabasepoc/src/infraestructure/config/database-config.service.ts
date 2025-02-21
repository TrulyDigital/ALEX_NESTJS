import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService{
  
  //
  private database_user: string;
  private database_pass: string;
  private database_procedure_path: string;
  private database_string: string;

  //
  constructor(
    private readonly config_service: ConfigService
  ){
    this.database_user = this.config_service.get<string>('DATABASE_USER') as string;
    this.database_pass = this.config_service.get<string>('DATABASE_PASS') as string;
    this.database_procedure_path = this.config_service.get<string>('DATABASE_PROCEDURE_PATH') as string;
    this.database_string = this.config_service.get<string>('DATABASE_STRING') as string;
  }

  get_database_user(): string{
    return this.database_user;
  }

  get_database_pass(): string{
    return this.database_pass;
  }

  get_database_procedure_path(): string{
    return this.database_procedure_path;
  }

  get_database_string(): string{
    return this.database_string;
  }
}