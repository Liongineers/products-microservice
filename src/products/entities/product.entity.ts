import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class Product {
  @ApiProperty({
    description: 'Unique product identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  prod_id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'MacBook Pro 13-inch',
  })
  prod_name: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'Seller UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  seller_info: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Excellent condition MacBook Pro, perfect for students',
  })
  description: string;

  @ApiProperty({
    description: 'Number of items available',
    example: 1,
    minimum: 0,
  })
  availability: number;

  @ApiProperty({
    description: 'Product price',
    example: 1200.00,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product condition',
    example: 'used',
  })
  condition: string;

  @ApiProperty({
    description: 'Total quantity of the product',
    example: 1,
    minimum: 0,
  })
  quantity: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Whether the product is archived',
    example: false,
  })
  is_archived: boolean;

  @ApiProperty({
    description: 'Whether the product is sold out',
    example: false,
  })
  is_sold: boolean;

  constructor(partial: Partial<Product>) {
    Object.assign(this, {
      prod_id: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
      is_archived: false,
      is_sold: false,
      ...partial,
    });
  }
}
