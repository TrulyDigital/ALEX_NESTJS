import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * 
 * @description
 * 
 * Definir un tipo de objeto para leer solamente
 * las rutas de las variables de entorno
 * 
 */
type RoutesType = {
  APPLICATION_BASE_PATH: string;
  APPLICATION_PORT: string;
  APPLICATION_SWAGGER_PATH: string;
  APPLICATION_OPERATION_REGISTER_RESOURCES: string;
};

// configuración .env raiz.
const envRoot: RoutesType = dotenv.config(
  {
    path: path.resolve(
      __dirname,
      '../../../',
      '.env'
    )
  }
).parsed as RoutesType;


/**
 * 
 * @description
 * 
 * Obtener la ruta base del Microservicio
 * 
 * @param base_path 
 * 
 * Variable de entorno del archivo .env si existe.
 * 
 */
export function get_app_base_path(
  base_path: string | undefined,
): string{
  
  if(base_path === undefined){
    return '/MS/SVC/Service/RSServiceOracleDatabase/V1';
  }
  return envRoot.APPLICATION_BASE_PATH;
}


/**
 * 
 * @description
 * 
 * Obtener el puerto del microservicio
 * 
 * @param port 
 * 
 * Variable de entorno del archivo .env si existe.
 * 
 */
export function get_app_port(
  port: string | undefined,
): string {

  if(port === undefined){
    return '8080';
  }
  
  try{
    parseInt(port);
    return port;
  }
  catch(err: any){
    throw new Error(`La variable de entorno APP_PORT no es un valor numérico, ${err.toString()}`);
  }
}


/**
 * 
 * @description
 * 
 * Obtener la ruta base del Microservicio para la
 * documentación swagger
 * 
 * @param swagger_path 
 * 
 * Variable de entorno del archivo .env si existe.
 * 
 */
export function get_app_swagger_path(
  swagger_path: string | undefined,
): string{
  if(swagger_path === undefined){
    return '/api';
  }
  return envRoot.APPLICATION_SWAGGER_PATH;
}



/**
 * 
 * @description
 * 
 * Obtener la ruta de la operación
 * 
 * @param operation 
 * 
 * Variable de entorno del archivo .env si existe.
 * 
 */
export function get_app_operation_find_properties(
  operation: string | undefined,
): string{
  if(operation === undefined){
    return '/New/Resources'
  }
  return envRoot.APPLICATION_OPERATION_REGISTER_RESOURCES;
}

/**
 * 
 * @description
 * 
 * Exportar ruta base y ruta de cada operación
 * 
 */
export const routes: RoutesType = {
  APPLICATION_BASE_PATH: get_app_base_path(
    envRoot.APPLICATION_BASE_PATH,
  ),
  APPLICATION_PORT: get_app_port(
    envRoot.APPLICATION_PORT,
  ),
  APPLICATION_SWAGGER_PATH: get_app_swagger_path(
    envRoot.APPLICATION_SWAGGER_PATH,
  ),
  APPLICATION_OPERATION_REGISTER_RESOURCES: get_app_operation_find_properties(
    envRoot.APPLICATION_OPERATION_REGISTER_RESOURCES,
  )
}

