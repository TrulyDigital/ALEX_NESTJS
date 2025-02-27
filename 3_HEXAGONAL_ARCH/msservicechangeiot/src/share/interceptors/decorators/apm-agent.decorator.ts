import { AppStateService } from "../../state/app-state.service";
import * as apm from 'elastic-apm-node';

export function ApmAgent(): InterceptorType{
  return function(
    target: Object,
    property_key: string | symbol,
    descriptor: PropertyDescriptor,
  ): void{

    // get original method
    const original_method = descriptor.value;

    // overwrite method
    descriptor.value = async function (
      ...args: any[]
    ): Promise<unknown> {

      // -------------------------
      // before
      // -------------------------

      // data
      const app_state: AppStateService = this.get_app_state();
      
      // apm
      const init_time: number = new Date().getTime();
      let apm_span: apm.Span | null = apm.startSpan(
        app_state.get_apm_span_data(property_key as string).span_name,
        app_state.get_apm_span_data(property_key as string).span_type,
        app_state.get_apm_span_data(property_key as string).span_sub_type,
        app_state.get_apm_span_data(property_key as string).span_action,
      );
      
      try{

        // -------------------------
        // execute original method
        // -------------------------

        const result: Promise<any> = await original_method.apply(this, args);
        const end_time: number = new Date().getTime();

        // -------------------------
        // after success
        // -------------------------
        
        // apm must be initialized in the main file
        if(apm_span){
          apm_span.setLabel('processingTime', `${end_time-init_time}`);
          apm_span.end();
        }
        
        return result;
      }
      finally{
        if(apm_span){
          const end_time: number = new Date().getTime();
          apm_span.setLabel('processingTime', `${end_time-init_time}`);
          apm_span.end();
        }
      }  
    };
  }
}