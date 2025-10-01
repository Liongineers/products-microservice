import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductFiltersDto } from './product-filters.dto';

export class ProductSearchDto {
  @ApiProperty({
    description: 'Search query string',
    example: 'MacBook',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Additional filters to apply',
    type: ProductFiltersDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductFiltersDto)
  filters?: ProductFiltersDto;
}
