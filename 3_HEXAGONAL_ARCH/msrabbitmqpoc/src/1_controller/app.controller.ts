import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from 'src/2_producer/producer.service';


@Controller('/rabbitmq')
export class AppController {
  constructor(
    private readonly producer_service: ProducerService
  ){}

  @Post()
  send_message(
    @Body() data: any
  ): any {
    this.producer_service.send_message(data);
    return { message: 'Mensaje enviado a RabbitMQ', data };
  }
}
