import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class ServiceProducer implements OnModuleInit{

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafka_client: ClientKafka
  ){}

  async onModuleInit() {
    this.kafka_client.subscribeToResponseOf('poc');
    await this.kafka_client.connect();
  }

  send_message(msg: any){
    return this.kafka_client.emit('poc', msg);
  }
}