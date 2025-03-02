import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProducerService } from './2_producer/producer.service';
import { ConsumerController } from './3_consumer/consumer.controller';
import { AppController } from './1_controller/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule], // read .env file when we use factory
        inject: [ConfigService], // read each one of environment variables
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') as string],
            queue: configService.get<string>('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: false,
            },
          }
        }),
      },
    ])
  ],
  providers: [
    ProducerService
  ],
  controllers: [
    AppController,
    ConsumerController
  ],
})
export class AppModule {}
