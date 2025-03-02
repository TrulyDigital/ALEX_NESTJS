import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class ConsumerController {
  
  @EventPattern('task_created') // Escucha mensajes de la cola
  handle_message(@Payload() data: any) {
    console.log('📩 Mensaje recibido:', data);
    // Aquí puedes procesar el mensaje, guardar en BD, etc.
  }
}