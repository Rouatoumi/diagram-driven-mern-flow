// src/types/index.ts
export interface SubCategory {
    _id: string;
    name: string;
  }
  
  export interface Category {
    _id: string;
    name: string;
    subCategories: SubCategory[];
  }
  export interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    startingPrice: number;
    currentPrice: number;
    bidStartDate: Date;
    bidEndDate: Date;
    subCategoryId: string;
    ownerId: string;
    ownerEmail: string;
    buyerId?: string;
  }