import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List products with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [Product],
  })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'seller_info', required: false, description: 'Filter by seller UUID' })
  @ApiQuery({ name: 'condition', required: false, description: 'Filter by condition' })
  @ApiQuery({ name: 'min_price', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'max_price', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'min_availability', required: false, description: 'Minimum availability filter' })
  @ApiQuery({ name: 'is_archived', required: false, description: 'Filter by archived status' })
  @ApiQuery({ name: 'is_sold', required: false, description: 'Filter by sold status' })
  findAll(
    @Query('category') category?: string,
    @Query('seller_info') seller_info?: string,
    @Query('condition') condition?: string,
    @Query('min_price') min_price?: number,
    @Query('max_price') max_price?: number,
    @Query('min_availability') min_availability?: number,
    @Query('is_archived') is_archived?: boolean,
    @Query('is_sold') is_sold?: boolean,
  ): Product[] {
    const filters: ProductFiltersDto = {
      category,
      seller_info,
      condition,
      min_price,
      max_price,
      min_availability,
      is_archived,
      is_sold,
    };
    return this.productsService.findAll(filters);
  }

  @Get('seller/:seller_id')
  @ApiOperation({ summary: 'List products by seller ID' })
  @ApiParam({ name: 'seller_id', description: 'Seller UUID' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [Product],
  })
  findBySeller(@Param('seller_id') sellerId: string): Product[] {
    return this.productsService.findBySeller(sellerId);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search products by query string and filters' })
  @ApiBody({ type: ProductSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: [Product],
  })
  search(@Body() searchDto: ProductSearchDto): Product[] {
    return this.productsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Product {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/availability')
  @ApiOperation({ summary: 'Update product availability' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({ type: UpdateAvailabilityDto })
  @ApiResponse({
    status: 200,
    description: 'Availability updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid availability value',
  })
  updateAvailability(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ): Product {
    return this.productsService.updateAvailability(id, updateAvailabilityDto.availability);
  }

  @Patch(':id/mark-sold')
  @ApiOperation({ summary: 'Mark a product as sold' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product marked as sold successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  markAsSold(@Param('id') id: string): Product {
    return this.productsService.markAsSold(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product archived successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  archive(@Param('id') id: string): Product {
    return this.productsService.archive(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore an archived product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product restored successfully',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  restore(@Param('id') id: string): Product {
    return this.productsService.restore(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product permanently' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Product deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): { message: string } {
    return this.productsService.remove(id);
  }
}
