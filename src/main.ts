import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting Products Microservice...');
    console.log('📊 Environment:', {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST ? 'set' : 'not set',
      CLOUD_SQL_CONNECTION_NAME: process.env.CLOUD_SQL_CONNECTION_NAME ? 'set' : 'not set',
    });

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Enable validation pipes
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Enable CORS
    app.enableCors();

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('Student Marketplace Products API')
      .setDescription('Products microservice for student marketplace - handles product listings, search, and management')
      .setVersion('0.1.0')
      .addTag('products')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Cloud Run requires PORT env var, default to 8080 if not set
    const port = parseInt(process.env.PORT || '8080', 10);
    
    // Ensure we listen on 0.0.0.0 (required for Cloud Run)
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Products microservice running on: http://0.0.0.0:${port}`);
    console.log(`📚 API Documentation: http://0.0.0.0:${port}/docs`);
    console.log(`✅ Server is ready to accept connections on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    process.exit(1);
  }
}

bootstrap();
