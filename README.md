# Product Microservice for Student Marketplace

Houses all logic related to selling, listing and buying products in the student marketplace.

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
