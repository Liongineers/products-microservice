import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'MacBook Pro 13-inch',
  })
  @IsString()
  prod_name: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Seller UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  seller_info: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Excellent condition MacBook Pro, perfect for students',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Number of items available',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  availability: number;

  @ApiProperty({
    description: 'Product price',
    example: 1200.00,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product condition',
    example: 'used',
  })
  @IsString()
  condition: string;

  @ApiProperty({
    description: 'Total quantity of the product',
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
