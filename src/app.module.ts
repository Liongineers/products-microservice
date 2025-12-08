import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
})
export class AppModule {}
