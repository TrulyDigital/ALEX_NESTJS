import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  // http instance
  const app = await NestFactory.create(AppModule);
  const config_service = app.get(ConfigService);

  // enable microservices feature
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers:[
            config_service.get<string>('KAFKA_BROKER_1') as string,
            config_service.get<string>('KAFKA_BROKER_2') as string,
          ]   
        }
      }
    }
  );

  // init app
  await app.startAllMicroservices();
  await app.listen(8080);
}
bootstrap();
