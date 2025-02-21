export class RegisterResourcesOutEntity{

  //
  private output_code: string;
  private output_description: string;
  private mobile_number: string | null;
  private transaction_id: string;

  /**
   * 
   * getters 
   * 
   */

  get_output_code(): string{
    return this.output_code;
  }

  get_output_description(): string{
    return this.output_description;
  }

  get_mobile_number(): string | null{
    return this.mobile_number;
  }

  get_transaction_id(): string{
    return this.transaction_id;
  }

  /**
   * 
   * setters
   * 
   */

  set_output_code(output_code: string): void{
    this.output_code = output_code;
  }
  
  set_output_description(output_description: string): void{
    this.output_description = output_description;
  }

  set_mobile_number(mobile_number: string | null): void{
    this.mobile_number = mobile_number;
  }

  set_transaction_id(transaction_id: string): void{
    this.transaction_id = transaction_id;
  }

}