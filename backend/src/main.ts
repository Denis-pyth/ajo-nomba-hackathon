import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Ajo Hackathon API')
    .setDescription('The backend API for the Ajo Nomba integration')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS so Jonnie's frontend can talk to your backend
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();