import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, Min, IsPositive, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  product_name?: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Seller UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  seller_id?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Excellent condition MacBook Pro, perfect for students',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Number of items available',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availability?: number;

  @ApiProperty({
    description: 'Product price',
    example: 1200.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'Product condition',
    example: 'used',
    required: false,
  })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({
    description: 'Total quantity of the product',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;
}
