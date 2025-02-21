import { Injectable } from "@nestjs/common";

@Injectable()
export class AppStateService{

  //
  private transaction_id: string;

  /**
   * 
   * Setters
   * 
   */

  set_transaction_id(transaction_id: string){
    this.transaction_id = transaction_id;
  }

  /**
   * 
   * Getters
   * 
   */
  
  get_transaction_id(): string{
    return this.transaction_id;
  }
}