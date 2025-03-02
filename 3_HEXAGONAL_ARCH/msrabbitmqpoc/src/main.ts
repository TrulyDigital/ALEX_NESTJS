import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  // http instance
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // enable microservice features 
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: { queueOptions: { durable: false },
        urls:[ configService.get<string>('RABBITMQ_URL') as string ],
        queue: configService.get<string>('RABBITMQ_QUEUE'),
      },
    },
  );

  // init app
  await app.startAllMicroservices();
  await app.listen(8080);
}
bootstrap();
