from __future__ import annotations

import os
from typing import Dict, List
from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi import Query
from typing import Optional

from models.product import ProductCreate, ProductRead, ProductUpdate, ProductFilters, ProductSearchQuery

port = int(os.environ.get("FASTAPIPORT", 8000))

# -----------------------------------------------------------------------------
# Fake in-memory "database"
# -----------------------------------------------------------------------------
products: Dict[UUID, ProductRead] = {}

app = FastAPI(
    title="Student Marketplace Products API",
    description="Products microservice for student marketplace - handles product listings, search, and management",
    version="0.1.0",
)


# -----------------------------------------------------------------------------
# Product endpoints
# -----------------------------------------------------------------------------

@app.post("/products", response_model=ProductRead, status_code=201)
def create_product(product: ProductCreate):
    """Create a new product"""
    pass

@app.get("/products/{prod_id}", response_model=ProductRead)
def get_product(prod_id: UUID):
    """Get a product by ID"""
    pass

@app.get("/products", response_model=List[ProductRead])
def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    seller_info: Optional[UUID] = Query(None, description="Filter by seller UUID"),
    condition: Optional[str] = Query(None, description="Filter by condition"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    min_availability: Optional[int] = Query(None, ge=0, description="Minimum availability filter"),
    is_archived: Optional[bool] = Query(None, description="Filter by archived status"),
    is_sold: Optional[bool] = Query(None, description="Filter by sold status"),
):
    """List products with optional filters"""
    pass

@app.get("/products/seller/{seller_id}", response_model=List[ProductRead])
def list_products_by_seller(seller_id: UUID):
    """List products by seller ID"""
    pass

@app.post("/products/search", response_model=List[ProductRead])
def search_products(search_query: ProductSearchQuery):
    """Search products by query string and filters"""
    pass

@app.patch("/products/{prod_id}", response_model=ProductRead)
def update_product(prod_id: UUID, update: ProductUpdate):
    """Update a product"""
    pass

@app.patch("/products/{prod_id}/availability", response_model=ProductRead)
def update_availability(prod_id: UUID, availability: int = Query(..., ge=0, description="New availability count")):
    """Update product availability"""
    pass

@app.patch("/products/{prod_id}/mark-sold", response_model=ProductRead)
def mark_as_sold(prod_id: UUID):
    """Mark a product as sold"""
    pass

@app.patch("/products/{prod_id}/archive", response_model=ProductRead)
def archive_product(prod_id: UUID):
    """Archive a product"""
    pass

@app.patch("/products/{prod_id}/restore", response_model=ProductRead)
def restore_product(prod_id: UUID):
    """Restore an archived product"""
    pass

@app.delete("/products/{prod_id}")
def delete_product(prod_id: UUID):
    """Delete a product permanently"""
    pass

# -----------------------------------------------------------------------------
# Root
# -----------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Welcome to the Student Marketplace Products API. See /docs for OpenAPI UI."}

# -----------------------------------------------------------------------------
# Entrypoint for `python main.py`
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
