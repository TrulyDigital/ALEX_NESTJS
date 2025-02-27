import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable() 
export class CircuitBreakerConfigService{

  //
  private breaker_threshold: number;
  private breaker_halfopen: number;
  private breaker_sleep: number;

  //
  constructor(
    private readonly config_service: ConfigService
  ){
    this.breaker_threshold = this.config_service.get<number>('APPLICATION_CIRCUIT_BREAKER_THRESHOLD') as number;
    this.breaker_halfopen = this.config_service.get<number>('APPLICATION_CIRCUIT_BREAKER_HALF_OPEN') as number;
    this.breaker_sleep = this.config_service.get<number>('APPLICATION_CIRCUIT_BREAKER_SLEEP') as number;
  }

  get_breaker_threshold(): number{
    return this.breaker_threshold;
  }

  get_breaker_halfopen(): number{
    return this.breaker_halfopen;
  }

  get_breaker_sleep(): number{
    return this.breaker_sleep;
  }
}