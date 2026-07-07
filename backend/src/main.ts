import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true lets us access the exact bytes Nomba signed, so webhook
  // HMAC verification is computed against the real payload instead of a
  // re-serialized copy (which can differ in key order/whitespace and
  // cause valid webhooks to fail signature checks).
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Activates the @IsString()/@IsNotEmpty()/etc decorators already present
  // on DTOs (e.g. UpdateBankDetailsDto) — without this, they're inert.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Ajo Hackathon API')
    .setDescription('The backend API for the Ajo Nomba integration')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS so Jonnie's frontend can talk to  backend
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
