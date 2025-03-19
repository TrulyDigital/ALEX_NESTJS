import { Module } from '@nestjs/common';
import { AppController } from './1_controller/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceProducer } from './2_producer/service.producer';
import { ServiceConsumer } from './3_consumer/service.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config_service: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers:[
                config_service.get<string>('KAFKA_BROKER_1') as string,
                config_service.get<string>('KAFKA_BROKER_2') as string,
              ]   
            }
          }
        })
      }
    ])
  ],
  controllers: [
    AppController,
    ServiceConsumer,
  ],
  providers: [
    ServiceProducer
  ],
})
export class AppModule {}
