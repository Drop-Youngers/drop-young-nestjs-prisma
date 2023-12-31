import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './filters/AppExceptionFilter';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  configDotenv()
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: "*" });
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({}));

  const config = new DocumentBuilder()
    .setTitle('NEST JS & PRISMA API documentation')
    .setDescription('The documentation for the AIC API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .setContact("Jazzy Bruno" , "https://github.com/jazzybruno" , "jazzybruno45@gmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);


  await app.listen(process.env.PORT);

}

bootstrap();