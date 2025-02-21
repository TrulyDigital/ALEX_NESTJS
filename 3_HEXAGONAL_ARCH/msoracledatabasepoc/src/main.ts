import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { routes } from './interfaces/routes/routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(routes.APPLICATION_PORT);
}
bootstrap();
