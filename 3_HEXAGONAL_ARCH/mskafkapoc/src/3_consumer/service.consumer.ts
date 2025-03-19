import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ServiceConsumer{

  @MessagePattern('poc')
  pull_message(@Payload() msg: any){
    console.log({ 
      status: 'Consumer',
      message: msg 
    });
  }
}