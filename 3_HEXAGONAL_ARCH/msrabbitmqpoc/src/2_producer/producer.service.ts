import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy
  ) {}

  send_message(data: any) {
    console.log('📤 Enviando mensaje:', data);
    return this.client.emit('task_created', data); // Envía mensaje a RabbitMQ
  }
}