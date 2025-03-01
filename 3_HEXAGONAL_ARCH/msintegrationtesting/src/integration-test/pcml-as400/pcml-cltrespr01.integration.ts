import * as node_jt_400 from 'node-jt400';

/**
 * 
 * @description
 * 
 * Types
 * 
 */

type JtAS400ConfigType = {
  host: string;
  user: string;
  password: string;
  trace: boolean;
};

type PcmlSchemaType = {
  type: string;
  precision: number;
  scale?: number;
  size?: number;
  name: string;
}

type PcmlDefinitionType = {
  name: string;
  schema: PcmlSchemaType[];
}

type PcmlRequestType = {
  'CUENTA': string;
  'PROVEEDOR': string;
}

/**
 * 
 * @description
 * 
 * Function
 * 
 */

export async function pcml_cltrespr01(): Promise<void>{

  const as400_config: JtAS400ConfigType = {
    host: '192.168.5.70',
    user: 'SISFIJA',
    password: 'SISFIJA',
    trace: true
  };

  const pcml_definition: PcmlDefinitionType = {
    name: 'CLEUHPR00',
    schema: [
      {
        type: 'CHAR',
        precision: 8,
        name: 'CUENTA'
      },
      {
        type: 'CHAR',
        precision: 10,
        name: 'PROVEEDOR'
      },
      {
        type: 'CHAR',
        precision: 10,
        name: 'PRODUCT_ID'
      },
      {
        type: 'CHAR',
        precision: 1600,
        name: 'TRAMARESPUESTA'
      }
    ]
  };

  const pcml_request_1: PcmlRequestType = {
    CUENTA: '48359398',
    PROVEEDOR: 'PA00002910'
  };

  const pool: node_jt_400.Connection = node_jt_400.pool(as400_config);
  const pcml_program = pool.defineProgram({
    programName: pcml_definition.name,
    paramsSchema: pcml_definition.schema
  });

  try{

    // call legacy

    const init_time: number = new Date().getTime();
    const pcml_response = await pcml_program(
      pcml_request_1,
      30
    );
    const end_time: number = new Date().getTime();

    // log
    console.log(
      {
        request: pcml_request_1,
        response: pcml_response,
        processing_time: `${end_time-init_time} ms`
      }
    );
  }
  catch(err: any){
    console.log(err);
  }
}