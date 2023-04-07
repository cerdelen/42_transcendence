import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*",
    credentials: true
  });  
  try {
    await app.listen(3003);
    console.log("backend ip", process.env.SERV_IP);
    
  }
  catch(error) 
  {}
}
bootstrap();

