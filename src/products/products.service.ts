import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Note: seller_id validation is handled by the composite service
      // This microservice trusts that the composite service has validated the seller exists
      
      // Map DTO fields to database columns
      const product = this.productRepository.create({
        product_name: createProductDto.product_name,
        category: createProductDto.category,
        seller_id: createProductDto.seller_id,
        description: createProductDto.description,
        availability: createProductDto.availability,
        price: createProductDto.price,
        condition: createProductDto.condition,
        quantity: createProductDto.quantity,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Database create failed:', error);
      throw new BadRequestException('Failed to create product: ' + error.message);
    }
  }

  async findAll(filters?: ProductFiltersDto): Promise<Product[]> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      if (filters) {
        if (filters.category) {
          queryBuilder.andWhere('LOWER(product.category) = LOWER(:category)', {
            category: filters.category,
          });
        }
        if (filters.seller_info) {
          queryBuilder.andWhere('product.seller_id = :sellerId', {
            sellerId: filters.seller_info,
          });
        }
        if (filters.condition) {
          queryBuilder.andWhere('LOWER(product.condition) = LOWER(:condition)', {
            condition: filters.condition,
          });
        }
        if (filters.min_price !== undefined) {
          queryBuilder.andWhere('product.price >= :minPrice', {
            minPrice: filters.min_price,
          });
        }
        if (filters.max_price !== undefined) {
          queryBuilder.andWhere('product.price <= :maxPrice', {
            maxPrice: filters.max_price,
          });
        }
        if (filters.min_availability !== undefined) {
          queryBuilder.andWhere('product.availability >= :minAvailability', {
            minAvailability: filters.min_availability,
          });
        }
        // Note: is_archived and is_sold filters are not available in current DB schema
        // You may need to add these columns to the database
        if (filters.is_sold !== undefined) {
          if (filters.is_sold) {
            queryBuilder.andWhere('product.availability = 0');
          } else {
            queryBuilder.andWhere('product.availability > 0');
          }
        }
      }

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Database findAll failed:', error);
      throw new BadRequestException('Failed to retrieve products: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { product_id: id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database findOne failed:', error);
      throw new BadRequestException('Failed to retrieve product: ' + error.message);
    }
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: { seller_id: sellerId },
      });
    } catch (error) {
      console.error('Database findBySeller failed:', error);
      throw new BadRequestException('Failed to retrieve products by seller: ' + error.message);
    }
  }

  async search(searchDto: ProductSearchDto): Promise<Product[]> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      // Apply search query
      const queryLower = searchDto.query.toLowerCase();
      queryBuilder.where(
        '(LOWER(product.product_name) LIKE :query OR LOWER(product.description) LIKE :query OR LOWER(product.category) LIKE :query)',
        { query: `%${queryLower}%` },
      );

      // Apply filters if provided
      if (searchDto.filters) {
        if (searchDto.filters.category) {
          queryBuilder.andWhere('LOWER(product.category) = LOWER(:category)', {
            category: searchDto.filters.category,
          });
        }
        if (searchDto.filters.seller_info) {
          queryBuilder.andWhere('product.seller_id = :sellerId', {
            sellerId: searchDto.filters.seller_info,
          });
        }
        if (searchDto.filters.condition) {
          queryBuilder.andWhere('LOWER(product.condition) = LOWER(:condition)', {
            condition: searchDto.filters.condition,
          });
        }
        if (searchDto.filters.min_price !== undefined) {
          queryBuilder.andWhere('product.price >= :minPrice', {
            minPrice: searchDto.filters.min_price,
          });
        }
        if (searchDto.filters.max_price !== undefined) {
          queryBuilder.andWhere('product.price <= :maxPrice', {
            maxPrice: searchDto.filters.max_price,
          });
        }
        if (searchDto.filters.min_availability !== undefined) {
          queryBuilder.andWhere('product.availability >= :minAvailability', {
            minAvailability: searchDto.filters.min_availability,
          });
        }
        if (searchDto.filters.is_sold !== undefined) {
          if (searchDto.filters.is_sold) {
            queryBuilder.andWhere('product.availability = 0');
          } else {
            queryBuilder.andWhere('product.availability > 0');
          }
        }
      }

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Database search failed:', error);
      throw new BadRequestException('Failed to search products: ' + error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // Check if product exists (similar to review service pattern)
      const checkResult = await this.productRepository.findOne({
        where: { product_id: id },
      });

      if (!checkResult) {
        throw new NotFoundException(`Product not found`);
      }

      // Build update object dynamically (similar to review service pattern)
      const updateData: Partial<Product> = {
        updated_at: new Date(),
      };

      // Add fields to update only if they're provided
      if (updateProductDto.product_name !== undefined) {
        updateData.product_name = updateProductDto.product_name;
      }
      if (updateProductDto.category !== undefined) {
        updateData.category = updateProductDto.category;
      }
      if (updateProductDto.seller_id !== undefined) {
        updateData.seller_id = updateProductDto.seller_id;
      }
      if (updateProductDto.description !== undefined) {
        updateData.description = updateProductDto.description;
      }
      if (updateProductDto.availability !== undefined) {
        updateData.availability = updateProductDto.availability;
      }
      if (updateProductDto.price !== undefined) {
        updateData.price = updateProductDto.price;
      }
      if (updateProductDto.condition !== undefined) {
        updateData.condition = updateProductDto.condition;
      }
      if (updateProductDto.quantity !== undefined) {
        updateData.quantity = updateProductDto.quantity;
      }

      // Execute the update using TypeORM query builder (similar to review service pattern)
      await this.productRepository
        .createQueryBuilder()
        .update(Product)
        .set(updateData)
        .where('product_id = :id', { id })
        .execute();

      // Return the updated product (similar to review service returning updated fields)
      return await this.productRepository.findOne({
        where: { product_id: id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database update failed:', error);
      throw new BadRequestException('Failed to update product: ' + error.message);
    }
  }

  async updateAvailability(id: string, availability: number): Promise<Product> {
    try {
      const product = await this.findOne(id);

      if (availability < 0) {
        throw new BadRequestException('Availability cannot be negative');
      }

      product.availability = availability;
      product.updated_at = new Date();

      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Database updateAvailability failed:', error);
      throw new BadRequestException('Failed to update availability: ' + error.message);
    }
  }

  async markAsSold(id: string): Promise<Product> {
    try {
      const product = await this.findOne(id);
      product.availability = 0;
      product.updated_at = new Date();
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database markAsSold failed:', error);
      throw new BadRequestException('Failed to mark product as sold: ' + error.message);
    }
  }

  async archive(id: string): Promise<Product> {
    try {
      // Note: is_archived column doesn't exist in DB schema
      // You may need to add this column or implement soft delete
      const product = await this.findOne(id);
      product.updated_at = new Date();
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database archive failed:', error);
      throw new BadRequestException('Failed to archive product: ' + error.message);
    }
  }

  async restore(id: string): Promise<Product> {
    try {
      // Note: is_archived column doesn't exist in DB schema
      const product = await this.findOne(id);
      product.updated_at = new Date();
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database restore failed:', error);
      throw new BadRequestException('Failed to restore product: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database remove failed:', error);
      throw new BadRequestException('Failed to delete product: ' + error.message);
    }
  }
}
