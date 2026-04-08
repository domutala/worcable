import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  global.BASE_URL = process.env.BASE_URL ?? `http://localhost:${port}`;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  console.log(`Application is running on: ${BASE_URL}`);
}
bootstrap();
