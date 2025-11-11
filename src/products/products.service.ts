import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@Injectable()
export class ProductsService {
  private products: Map<string, Product> = new Map();

  create(createProductDto: CreateProductDto): Product {
    const product = new Product(createProductDto);
    this.products.set(product.prod_id, product);
    return product;
  }

  findAll(filters?: ProductFiltersDto): Product[] {
    let results = Array.from(this.products.values());

    if (!filters) {
      return results;
    }

    if (filters.category) {
      results = results.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.seller_info) {
      results = results.filter(p => p.seller_info === filters.seller_info);
    }
    if (filters.condition) {
      results = results.filter(p => p.condition.toLowerCase() === filters.condition.toLowerCase());
    }
    if (filters.min_price !== undefined) {
      results = results.filter(p => p.price >= filters.min_price);
    }
    if (filters.max_price !== undefined) {
      results = results.filter(p => p.price <= filters.max_price);
    }
    if (filters.min_availability !== undefined) {
      results = results.filter(p => p.availability >= filters.min_availability);
    }
    if (filters.is_archived !== undefined) {
      results = results.filter(p => p.is_archived === filters.is_archived);
    }
    if (filters.is_sold !== undefined) {
      results = results.filter(p => p.is_sold === filters.is_sold);
    }

    return results;
  }

  findOne(id: string): Product {
    const product = this.products.get(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  findBySeller(sellerId: string): Product[] {
    return Array.from(this.products.values()).filter(p => p.seller_info === sellerId);
  }

  search(searchDto: ProductSearchDto): Product[] {
    let results = searchDto.filters ? this.findAll(searchDto.filters) : Array.from(this.products.values());

    const queryLower = searchDto.query.toLowerCase();
    return results.filter(product => 
      product.prod_name.toLowerCase().includes(queryLower) ||
      product.description.toLowerCase().includes(queryLower) ||
      product.category.toLowerCase().includes(queryLower)
    );
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    
    Object.keys(updateProductDto).forEach(key => {
      if (updateProductDto[key] !== undefined) {
        product[key] = updateProductDto[key];
      }
    });
    
    product.updated_at = new Date();
    this.products.set(id, product);
    return product;
  }

  updateAvailability(id: string, availability: number): Product {
    const product = this.findOne(id);
    
    if (availability < 0) {
      throw new BadRequestException('Availability cannot be negative');
    }
    
    product.availability = availability;
    product.updated_at = new Date();
    
    // If availability is 0, mark as sold
    if (availability === 0) {
      product.is_sold = true;
    }
    
    this.products.set(id, product);
    return product;
  }

  markAsSold(id: string): Product {
    const product = this.findOne(id);
    product.is_sold = true;
    product.availability = 0;
    product.updated_at = new Date();
    this.products.set(id, product);
    return product;
  }

  archive(id: string): Product {
    const product = this.findOne(id);
    product.is_archived = true;
    product.updated_at = new Date();
    this.products.set(id, product);
    return product;
  }

  restore(id: string): Product {
    const product = this.findOne(id);
    product.is_archived = false;
    product.updated_at = new Date();
    this.products.set(id, product);
    return product;
  }

  remove(id: string): { message: string } {
    const product = this.findOne(id);
    this.products.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
