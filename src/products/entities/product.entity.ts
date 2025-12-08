import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  @Column({ name: 'product_id', type: 'char', length: 36 })
  product_id: string;

  // Map to prod_id for API compatibility
  get prod_id(): string {
    return this.product_id;
  }

  @ApiProperty({
    description: 'Product name',
    example: 'MacBook Pro 13-inch',
  })
  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  product_name: string;

  // Map to prod_name for API compatibility
  get prod_name(): string {
    return this.product_name;
  }

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  @Column({ type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({
    description: 'Seller UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ name: 'seller_id', type: 'char', length: 36 })
  seller_id: string;

  // Map to seller_info for API compatibility
  get seller_info(): string {
    return this.seller_id;
  }

  @ApiProperty({
    description: 'Product description',
    example: 'Excellent condition MacBook Pro, perfect for students',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Number of items available',
    example: 1,
    minimum: 0,
  })
  @Column({ type: 'int' })
  availability: number;

  @ApiProperty({
    description: 'Product price',
    example: 1200.00,
    minimum: 0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Product condition',
    example: 'used',
  })
  @Column({ type: 'varchar', length: 50 })
  condition: string;

  @ApiProperty({
    description: 'Total quantity of the product',
    example: 1,
    minimum: 0,
  })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  // Note: is_archived and is_sold are not in the database schema
  // These are computed properties based on availability
  get is_archived(): boolean {
    // You may want to add this column to the database
    return false;
  }

  get is_sold(): boolean {
    return this.availability === 0;
  }
}
