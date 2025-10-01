import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, Min, IsBoolean } from 'class-validator';

export class ProductFiltersDto {
  @ApiProperty({
    description: 'Filter by category',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Filter by seller UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  seller_info?: string;

  @ApiProperty({
    description: 'Filter by condition',
    example: 'used',
    required: false,
  })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({
    description: 'Minimum price filter',
    example: 100.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    example: 2000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiProperty({
    description: 'Minimum availability filter',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_availability?: number;

  @ApiProperty({
    description: 'Filter by archived status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_archived?: boolean;

  @ApiProperty({
    description: 'Filter by sold status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_sold?: boolean;
}
