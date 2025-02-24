import { DataConfigInfraestructureDto } from "../../share/config/dtos/data-config-infraestructure.dto";
import { DataConfigInterfaceDto } from "../../share/config/dtos/data-config-interface.dto";

export const DataConfigRepository = Symbol('DataConfigRepository');

export interface DataConfigRepository{
  get_data_config_infraestructure(): DataConfigInfraestructureDto;
  get_data_config_interface(): DataConfigInterfaceDto;
}