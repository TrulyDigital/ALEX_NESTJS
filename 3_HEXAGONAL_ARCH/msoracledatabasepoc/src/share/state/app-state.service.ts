import { Injectable } from "@nestjs/common";

@Injectable()
export class AppStateService{

  //
  private transaction_id: string;
  private verb: string;

  /**
   * 
   * Setters
   * 
   */

  set_transaction_id(transaction_id: string){
    this.transaction_id = transaction_id;
  }

  set_verb(verb: string){
    this.verb = verb;
  }

  /**
   * 
   * Getters
   * 
   */
  
  get_transaction_id(): string{
    return this.transaction_id;
  }

  get_verb(): string{
    return this.verb;
  }
  
}