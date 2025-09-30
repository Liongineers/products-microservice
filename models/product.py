from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """Base product model with common fields"""
    prod_name: str = Field(..., description="Product name")
    category: str = Field(..., description="Product category")
    seller_info: UUID = Field(..., description="Seller UUID")
    description: str = Field(..., description="Product description")
    availability: int = Field(..., ge=0, description="Number of items available")
    price: float = Field(..., gt=0, description="Product price")
    condition: str = Field(..., description="Product condition (new, used, refurbished, etc.)")
    quantity: int = Field(..., ge=0, description="Total quantity of the product")


class ProductCreate(ProductBase):
    """Model for creating a new product"""
    prod_id: UUID = Field(default_factory=uuid4, description="Unique product identifier")


class ProductRead(ProductBase):
    """Model for reading product data"""
    prod_id: UUID = Field(..., description="Unique product identifier")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Product creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Product last update timestamp")
    is_archived: bool = Field(default=False, description="Whether the product is archived")
    is_sold: bool = Field(default=False, description="Whether the product is sold out")


class ProductUpdate(BaseModel):
    """Model for updating product data - all fields optional"""
    prod_name: Optional[str] = Field(None, description="Product name")
    category: Optional[str] = Field(None, description="Product category")
    seller_info: Optional[UUID] = Field(None, description="Seller UUID")
    description: Optional[str] = Field(None, description="Product description")
    availability: Optional[int] = Field(None, ge=0, description="Number of items available")
    price: Optional[float] = Field(None, gt=0, description="Product price")
    condition: Optional[str] = Field(None, description="Product condition")
    quantity: Optional[int] = Field(None, ge=0, description="Total quantity of the product")


class ProductFilters(BaseModel):
    """Model for filtering products in list/search operations"""
    category: Optional[str] = Field(None, description="Filter by category")
    seller_info: Optional[UUID] = Field(None, description="Filter by seller")
    condition: Optional[str] = Field(None, description="Filter by condition")
    min_price: Optional[float] = Field(None, ge=0, description="Minimum price filter")
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price filter")
    min_availability: Optional[int] = Field(None, ge=0, description="Minimum availability filter")
    is_archived: Optional[bool] = Field(None, description="Filter by archived status")
    is_sold: Optional[bool] = Field(None, description="Filter by sold status")


class ProductSearchQuery(BaseModel):
    """Model for product search queries"""
    query: str = Field(..., description="Search query string")
    filters: Optional[ProductFilters] = Field(None, description="Additional filters to apply")
