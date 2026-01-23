// Unified product type that works with both mock data and database
export interface UnifiedProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  compare_at_price?: number | null;
  image: string;
  featured_image?: string | null;
  images: string[];
  category: string;
  category_id?: string | null;
  hairType: string;
  hair_type?: string | null;
  laceType: string;
  lace_type?: string | null;
  length: string;
  density: string;
  capSize: string[];
  cap_size?: string[] | null;
  colors: string[];
  description: string;
  careInstructions: string[];
  care_instructions?: string | null;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock_quantity?: number;
  bestseller?: boolean;
  is_bestseller?: boolean;
  new?: boolean;
  is_featured?: boolean;
}

// Helper function to normalize product from DB to unified format
export function normalizeProduct(dbProduct: any): UnifiedProduct {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: Number(dbProduct.price),
    originalPrice: dbProduct.compare_at_price ? Number(dbProduct.compare_at_price) : undefined,
    compare_at_price: dbProduct.compare_at_price,
    image: dbProduct.featured_image || dbProduct.images?.[0] || '/placeholder.svg',
    featured_image: dbProduct.featured_image,
    images: dbProduct.images || [dbProduct.featured_image || '/placeholder.svg'],
    category: dbProduct.category?.slug || dbProduct.category_id || '',
    category_id: dbProduct.category_id,
    hairType: dbProduct.hair_type || 'Human Hair',
    hair_type: dbProduct.hair_type,
    laceType: dbProduct.lace_type || '',
    lace_type: dbProduct.lace_type,
    length: dbProduct.length || '',
    density: dbProduct.density || '150%',
    capSize: dbProduct.cap_size || ['Small', 'Medium', 'Large'],
    cap_size: dbProduct.cap_size,
    colors: dbProduct.colors || ['Natural Black'],
    description: dbProduct.description || '',
    careInstructions: dbProduct.care_instructions 
      ? (typeof dbProduct.care_instructions === 'string' 
          ? dbProduct.care_instructions.split('\n').filter(Boolean)
          : dbProduct.care_instructions)
      : [],
    care_instructions: dbProduct.care_instructions,
    rating: 4.8, // Default rating since we don't have this in DB yet
    reviews: 0, // Default reviews count
    inStock: (dbProduct.stock_quantity || 0) > 0,
    stock_quantity: dbProduct.stock_quantity,
    bestseller: dbProduct.is_bestseller,
    is_bestseller: dbProduct.is_bestseller,
    new: dbProduct.is_featured,
    is_featured: dbProduct.is_featured,
  };
}
