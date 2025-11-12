# Testing in GCP Cloud Shell

## Setup Instructions

1. Run `gcloud auth login` in the Cloud Shell
2. Ensure you are running the correct project: `gcloud config set project YOUR_PROJECT_ID`
3. Verify authentication: `gcloud auth print-identity-token` (should return a token)

These commands work directly in the GCP Cloud Shell terminal and include authentication headers.

**Service URL:** `https://products-microservice-471529071641.us-east1.run.app`

## Quick Test Commands for Cloud Shell

### 1. Create a Product
```bash
curl -X POST "https://products-microservice-471529071641.us-east1.run.app/products" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "prod_name": "MacBook Pro 13-inch",
    "category": "Electronics",
    "seller_info": "123e4567-e89b-12d3-a456-426614174001",
    "description": "Excellent condition MacBook Pro, perfect for students",
    "availability": 1,
    "price": 1200.00,
    "condition": "used",
    "quantity": 1
  }'
```

**Save the `prod_id` from the response!** Example: `PRODUCT_ID="123e4567-e89b-12d3-a456-426614174000"`

### 2. Get All Products
```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "https://products-microservice-471529071641.us-east1.run.app/products"
```

### 3. Get Product by ID
```bash
# First, set PRODUCT_ID from step 1 response
PRODUCT_ID="your-product-id-here"

curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID"
```

### 4. Filter Products by Category
```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "https://products-microservice-471529071641.us-east1.run.app/products?category=Electronics"
```

### 5. Filter by Price Range
```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "https://products-microservice-471529071641.us-east1.run.app/products?min_price=100&max_price=500"
```

### 6. Get Products by Seller
```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  "https://products-microservice-471529071641.us-east1.run.app/products/seller/123e4567-e89b-12d3-a456-426614174001"
```

### 7. Search Products
```bash
curl -X POST "https://products-microservice-471529071641.us-east1.run.app/products/search" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "MacBook",
    "filters": {
      "category": "Electronics"
    }
  }'
```

### 8. Update Product
```bash
curl -X PATCH "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1100.00,
    "description": "Updated: Price reduced!"
  }'
```

### 9. Update Availability
```bash
curl -X PATCH "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID/availability" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{
    "availability": 0
  }'
```

### 10. Mark as Sold
```bash
curl -X PATCH "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID/mark-sold" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

### 11. Archive Product
```bash
curl -X PATCH "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID/archive" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

### 12. Restore Product
```bash
curl -X PATCH "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID/restore" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

### 13. Delete Product
```bash
curl -X DELETE "https://products-microservice-471529071641.us-east1.run.app/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)"
```
