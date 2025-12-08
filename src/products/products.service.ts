import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private getClient() {
    // Use Unix socket for Cloud SQL (Cloud Run) or TCP for local
    const socketPath = process.env.CLOUD_SQL_CONNECTION_NAME 
      ? `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
      : undefined;

    return new Client({
      host: socketPath || (process.env.DB_HOST || 'localhost'),
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'products',
    });
  }

  async testDbConnection() {
    const client = this.getClient();
    try {
      await client.connect();
      const result = await client.query('SELECT NOW() as time');
      await client.end();
      
      console.log('✅ Database connection successful');
      return { connected: true, databaseTime: result.rows[0].time };
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
      return { connected: false, error: error.message };
    }
  }

  async create(createProductDto: CreateProductDto): Promise<any> {
    console.log('CREATE METHOD CALLED');
    const client = this.getClient();
    try {
      console.log('Connecting to database...');
      await client.connect();
      console.log('Database connected successfully');
      
      console.log('Executing INSERT query...');
      
      // Generate UUID for product_id
      const productId = uuidv4();
      
      const result = await client.query(
        `INSERT INTO products (product_id, product_name, category, seller_id, description, availability, price, condition, quantity) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          productId,
          createProductDto.product_name,
          createProductDto.category,
          createProductDto.seller_id,
          createProductDto.description || null,
          createProductDto.availability,
          createProductDto.price,
          createProductDto.condition,
          createProductDto.quantity,
        ]
      );

      await client.end();

      const product = result.rows[0];
      console.log('INSERT successful:', product);

      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      console.error('CREATE METHOD FAILED:', error);
      await client.end();
      throw error;
    }
  }

  async findAll(filters?: ProductFiltersDto): Promise<any[]> {
    const client = this.getClient();
    try {
      await client.connect();

      let query = 'SELECT * FROM products WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (filters) {
    if (filters.category) {
          query += ` AND LOWER(category) = LOWER($${paramIndex})`;
          params.push(filters.category);
          paramIndex++;
    }
    if (filters.seller_info) {
          query += ` AND seller_id = $${paramIndex}`;
          params.push(filters.seller_info);
          paramIndex++;
    }
    if (filters.condition) {
          query += ` AND LOWER(condition) = LOWER($${paramIndex})`;
          params.push(filters.condition);
          paramIndex++;
    }
    if (filters.min_price !== undefined) {
          query += ` AND price >= $${paramIndex}`;
          params.push(filters.min_price);
          paramIndex++;
    }
    if (filters.max_price !== undefined) {
          query += ` AND price <= $${paramIndex}`;
          params.push(filters.max_price);
          paramIndex++;
    }
    if (filters.min_availability !== undefined) {
          query += ` AND availability >= $${paramIndex}`;
          params.push(filters.min_availability);
          paramIndex++;
    }
    if (filters.is_sold !== undefined) {
          if (filters.is_sold) {
            query += ' AND availability = 0';
          } else {
            query += ' AND availability > 0';
          }
        }
      }

      const result = await client.query(query, params);
      await client.end();

      return result.rows.map(row => ({
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        seller_id: row.seller_id,
        description: row.description,
        availability: row.availability,
        price: parseFloat(row.price),
        condition: row.condition,
        quantity: row.quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error) {
      console.error('Database findAll failed:', error);
      await client.end();
      return [];
    }
  }

  async findOne(id: string): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();

      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      if (result.rows.length === 0) {
      throw new NotFoundException('Product not found');
      }

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database findOne failed:', error);
      throw new BadRequestException('Failed to retrieve product: ' + error.message);
    }
  }

  async findBySeller(sellerId: string): Promise<any[]> {
    const client = this.getClient();
    try {
      await client.connect();

      const result = await client.query(
        'SELECT * FROM products WHERE seller_id = $1',
        [sellerId]
      );

      await client.end();

      return result.rows.map(row => ({
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        seller_id: row.seller_id,
        description: row.description,
        availability: row.availability,
        price: parseFloat(row.price),
        condition: row.condition,
        quantity: row.quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error) {
      console.error('Database findBySeller failed:', error);
      await client.end();
      return [];
    }
  }

  async search(searchDto: ProductSearchDto): Promise<any[]> {
    const client = this.getClient();
    try {
      await client.connect();

      let query = `SELECT * FROM products WHERE 
        (LOWER(product_name) LIKE $1 OR LOWER(description) LIKE $2 OR LOWER(category) LIKE $3)`;
      const params: any[] = [`%${searchDto.query.toLowerCase()}%`, `%${searchDto.query.toLowerCase()}%`, `%${searchDto.query.toLowerCase()}%`];
      let paramIndex = 4;

      if (searchDto.filters) {
        if (searchDto.filters.category) {
          query += ` AND LOWER(category) = LOWER($${paramIndex})`;
          params.push(searchDto.filters.category);
          paramIndex++;
        }
        if (searchDto.filters.seller_info) {
          query += ` AND seller_id = $${paramIndex}`;
          params.push(searchDto.filters.seller_info);
          paramIndex++;
        }
        if (searchDto.filters.condition) {
          query += ` AND LOWER(condition) = LOWER($${paramIndex})`;
          params.push(searchDto.filters.condition);
          paramIndex++;
        }
        if (searchDto.filters.min_price !== undefined) {
          query += ` AND price >= $${paramIndex}`;
          params.push(searchDto.filters.min_price);
          paramIndex++;
        }
        if (searchDto.filters.max_price !== undefined) {
          query += ` AND price <= $${paramIndex}`;
          params.push(searchDto.filters.max_price);
          paramIndex++;
        }
        if (searchDto.filters.min_availability !== undefined) {
          query += ` AND availability >= $${paramIndex}`;
          params.push(searchDto.filters.min_availability);
          paramIndex++;
        }
        if (searchDto.filters.is_sold !== undefined) {
          if (searchDto.filters.is_sold) {
            query += ' AND availability = 0';
          } else {
            query += ' AND availability > 0';
          }
        }
      }

      const result = await client.query(query, params);
      await client.end();

      return result.rows.map(row => ({
        product_id: row.product_id,
        product_name: row.product_name,
        category: row.category,
        seller_id: row.seller_id,
        description: row.description,
        availability: row.availability,
        price: parseFloat(row.price),
        condition: row.condition,
        quantity: row.quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error) {
      console.error('Database search failed:', error);
      await client.end();
      return [];
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();

      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException(`Product not found`);
      }

      // Build dynamic update query
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updateProductDto.product_name !== undefined) {
        updates.push(`product_name = $${paramIndex}`);
        values.push(updateProductDto.product_name);
        paramIndex++;
      }
      if (updateProductDto.category !== undefined) {
        updates.push(`category = $${paramIndex}`);
        values.push(updateProductDto.category);
        paramIndex++;
      }
      if (updateProductDto.seller_id !== undefined) {
        updates.push(`seller_id = $${paramIndex}`);
        values.push(updateProductDto.seller_id);
        paramIndex++;
      }
      if (updateProductDto.description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(updateProductDto.description);
        paramIndex++;
      }
      if (updateProductDto.availability !== undefined) {
        updates.push(`availability = $${paramIndex}`);
        values.push(updateProductDto.availability);
        paramIndex++;
      }
      if (updateProductDto.price !== undefined) {
        updates.push(`price = $${paramIndex}`);
        values.push(updateProductDto.price);
        paramIndex++;
      }
      if (updateProductDto.condition !== undefined) {
        updates.push(`condition = $${paramIndex}`);
        values.push(updateProductDto.condition);
        paramIndex++;
      }
      if (updateProductDto.quantity !== undefined) {
        updates.push(`quantity = $${paramIndex}`);
        values.push(updateProductDto.quantity);
        paramIndex++;
      }

      updates.push('updated_at = NOW()');
      values.push(id);

      const query = `UPDATE products SET ${updates.join(', ')} WHERE product_id = $${paramIndex}`;
      await client.query(query, values);

      // Fetch updated product
      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database update failed:', error);
      throw new BadRequestException('Failed to update product: ' + error.message);
    }
  }

  async updateAvailability(id: string, availability: number): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();
    
    if (availability < 0) {
        await client.end();
      throw new BadRequestException('Availability cannot be negative');
    }
    
      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException('Product not found');
      }

      await client.query(
        'UPDATE products SET availability = $1, updated_at = NOW() WHERE product_id = $2',
        [availability, id]
      );

      // Fetch updated product
      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Database updateAvailability failed:', error);
      throw new BadRequestException('Failed to update availability: ' + error.message);
    }
  }

  async markAsSold(id: string): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();

      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException('Product not found');
      }

      await client.query(
        'UPDATE products SET availability = 0, updated_at = NOW() WHERE product_id = $1',
        [id]
      );

      // Fetch updated product
      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database markAsSold failed:', error);
      throw new BadRequestException('Failed to mark product as sold: ' + error.message);
    }
  }

  async archive(id: string): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();

      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException('Product not found');
      }

      // Note: is_archived column doesn't exist in DB schema
      // Just update the timestamp for now
      await client.query(
        'UPDATE products SET updated_at = NOW() WHERE product_id = $1',
        [id]
      );

      // Fetch updated product
      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database archive failed:', error);
      throw new BadRequestException('Failed to archive product: ' + error.message);
    }
  }

  async restore(id: string): Promise<any> {
    const client = this.getClient();
    try {
      await client.connect();

      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException('Product not found');
      }

      // Note: is_archived column doesn't exist in DB schema
      await client.query(
        'UPDATE products SET updated_at = NOW() WHERE product_id = $1',
        [id]
      );

      // Fetch updated product
      const result = await client.query(
        'SELECT * FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

      const product = result.rows[0];
      return {
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        seller_id: product.seller_id,
        description: product.description,
        availability: product.availability,
        price: parseFloat(product.price),
        condition: product.condition,
        quantity: product.quantity,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database restore failed:', error);
      throw new BadRequestException('Failed to restore product: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const client = this.getClient();
    try {
      await client.connect();

      // Check if product exists
      const checkResult = await client.query(
        'SELECT product_id FROM products WHERE product_id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.end();
        throw new NotFoundException('Product not found');
      }

      await client.query(
        'DELETE FROM products WHERE product_id = $1',
        [id]
      );

      await client.end();

    return { message: 'Product deleted successfully' };
    } catch (error) {
      await client.end();
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Database remove failed:', error);
      throw new BadRequestException('Failed to delete product: ' + error.message);
    }
  }
}
