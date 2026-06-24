import { apiEvents } from '@constants/api/apiEvents';
import { log } from "@monorepo/logger";
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  apiEvents
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  log(`api running on ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
