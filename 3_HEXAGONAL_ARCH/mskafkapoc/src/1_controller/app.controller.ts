import { Body, Controller, Post } from '@nestjs/common';
import { ServiceProducer } from 'src/2_producer/service.producer';

@Controller()
export class AppController {
  constructor(
    private readonly service_producer: ServiceProducer
  ) {}

  @Post('kafka')
  send_message(@Body() body_in: any): any {
    this.service_producer.send_message(body_in);
    return {
      status: 'Producer',
      message: body_in
    }
  }
}
