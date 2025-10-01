# Product Microservice for Student Marketplace

Houses all logic related to selling, listing and buying products in the student marketplace. Built with NestJS and TypeScript.

## Features

### Product Management
- Create, read, update, and delete products
- Archive and restore products
- Mark products as sold
- Update product availability

### Search & Filtering
- Search products by name, description, and category
- Filter by category, seller, condition, price range, availability
- List products by seller

### Data Model
- **prod_id**: UUID (auto-generated)
- **prod_name**: Product name
- **category**: Product category
- **seller_info**: Seller UUID
- **description**: Product description
- **availability**: Number of items available
- **price**: Product price
- **condition**: Product condition (new, used, refurbished, etc.)
- **quantity**: Total quantity of the product

## API Endpoints

### Product Operations
- `POST /products` - Create a new product
- `GET /products/{prod_id}` - Get product by ID
- `PATCH /products/{prod_id}` - Update product
- `DELETE /products/{prod_id}` - Delete product permanently

### Product Listing & Search
- `GET /products` - List all products with optional filters
- `GET /products/seller/{seller_id}` - List products by seller
- `POST /products/search` - Search products with query and filters

### Product Status Management
- `PATCH /products/{prod_id}/availability` - Update availability
- `PATCH /products/{prod_id}/mark-sold` - Mark as sold
- `PATCH /products/{prod_id}/archive` - Archive product
- `PATCH /products/{prod_id}/restore` - Restore archived product

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Running the Service

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## Development

```bash
# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── products/
│   ├── dto/                    # Data Transfer Objects
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   ├── product-filters.dto.ts
│   │   ├── product-search.dto.ts
│   │   └── update-availability.dto.ts
│   ├── entities/               # Database entities
│   │   └── product.entity.ts
│   ├── products.controller.ts  # HTTP endpoints
│   ├── products.service.ts     # Business logic
│   └── products.module.ts      # Module definition
├── app.module.ts               # Root module
└── main.ts                     # Application entry point
```