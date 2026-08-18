import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Localhost siempre permitido (desarrollo). FRONTEND_URL se agrega
  // como variable en Railway una vez que el frontend esté en Vercel,
  // sin necesidad de tocar código de nuevo.
  const allowedOrigins = ['http://localhost:4200'];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
