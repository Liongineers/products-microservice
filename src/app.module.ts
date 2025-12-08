import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // For Cloud SQL, use Unix socket connection when running on Cloud Run
      // Format: /cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
      socketPath: process.env.CLOUD_SQL_CONNECTION_NAME 
        ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
        : undefined,
      // For local development or TCP connection
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'products_db',
      entities: [Product],
      synchronize: false, // Set to false in production - use migrations instead
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 3000,
      extra: {
        // Connection pool settings
        connectionLimit: 10,
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}
