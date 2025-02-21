type LogType<T1,T2> = {
  applicationName: string;
  methodName: string;
  verb: string;
  transactionId: string;
  layer: string;
  type: string;
  message: string;
  processingTime: number;
  timeStamp: string;
  request: T1;
  response: T2;
}

export class LogEntity <T1,T2>{

  private applicationName: string;
  private methodName: string;
  private verb: string;
  private transactionId: string;
  private layer: string;
  private type: string;
  private message: string;
  private processingTime: number;
  private timeStamp: string;
  private request: T1;
  private response: T2 | string;

  constructor(
    application_name: string,
    method_name: string
  ){
    this.applicationName = application_name;
    this.methodName = method_name;
  }

  /**
   * 
   * Setters
   * 
   */

  set_verb(verb: string): void{
    this.verb = verb;
  }

  set_transaction_id(transaction_id: string): void{
    this.transactionId = transaction_id;
  }

  set_layer(layer: string): void{
    this.layer = layer;
  }

  set_type(type: string): void{
    this.type = type;
  }

  set_message(message: string): void{
    this.message = message;
  }

  set_processing_time(processing_time: number): void{
    this.processingTime = processing_time;
  }

  set_time_stamp(time_stamp: string): void{
    this.timeStamp = time_stamp;
  }

  set_request(request: T1): void{
    this.request = request;
  }

  set_response(response: T2 | string): void{
    this.response = response;
  }

  /**
   * 
   * Getters
   * 
   */

  get_log(): LogType<T1,T2 | string>{
    return {
      applicationName: this.applicationName,
      methodName: this.methodName,
      verb: this.verb,
      transactionId: this.transactionId,
      layer: this.layer,
      type: this.type,
      message: this.message,
      processingTime: this.processingTime,
      timeStamp: this.timeStamp,
      request: this.request,
      response: this.response
    }
  }
}