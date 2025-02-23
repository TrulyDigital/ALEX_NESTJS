import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class InRegisterResourcesDto{

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  iccid: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  enterprise_id: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  eid: string;

  @IsDefined()
  @IsString()
  imei: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  plan_id: string;

  @IsDefined()
  @IsString()
  location: string;
}