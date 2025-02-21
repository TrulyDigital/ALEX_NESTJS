import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OutPrcRegistraUsuariosDto{

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vcmsisdn: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  vccodsal: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  vcdessal: string;
}