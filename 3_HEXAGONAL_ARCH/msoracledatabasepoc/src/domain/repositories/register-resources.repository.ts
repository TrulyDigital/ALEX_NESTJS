import { RegisterResourcesInEntity } from "../entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../entities/register-resources-out.entity";

export const I_REGISTER_RESOURCES_REPOSITORY = 'I_REGISTER_RESOURCES_REPOSITORY';

export interface RegisterResourcesRepository{
  update_one(register_resources_in: RegisterResourcesInEntity): Promise<RegisterResourcesOutEntity>;
}