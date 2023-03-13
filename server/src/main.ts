import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  });
  try {

    await app.listen(3003);

    console.log("listening on port 3003");
  } catch(error) {
    console.log(error);

  }
  
}
bootstrap();
