import { RegisterResourcesInEntity } from "../entities/register-resources-in.entity";
import { RegisterResourcesOutEntity } from "../entities/register-resources-out.entity";

export const RegisterResourcesRepository = Symbol('RegisterResourcesRepository');

export interface RegisterResourcesRepository{
  update_one(
    register_resources_in: RegisterResourcesInEntity
  ): Promise<RegisterResourcesOutEntity>;
}