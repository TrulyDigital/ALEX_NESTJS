import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { routes } from './interfaces/routes/routes';
import * as apm from 'elastic-apm-node';

async function bootstrap() {

  /**
   * 
   * @description 
   * 
   * Definir APM antes que inicie el servidor express
   * 
   */
  const apm_agent = {
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
    environment: process.env.ELASTIC_APM_ENVIRONMENT,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    errorOnAbortedRequests: true,
    stackTraceLimit: 500,
    active: process.env.ELASTIC_APM_ACTIVE === 'true' ? true : false,
  }; 
  apm.start(apm_agent);

  const app = await NestFactory.create(AppModule);
  await app.listen(routes.APPLICATION_PORT);
}
bootstrap();
