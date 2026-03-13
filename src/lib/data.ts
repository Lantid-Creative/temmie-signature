export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  hairType: string;
  laceType: string;
  length: string;
  density: string;
  capSize: string[];
  colors: string[];
  description: string;
  careInstructions: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  bestseller?: boolean;
  new?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  productName: string;
  verified: boolean;
}

export const collections: Collection[] = [
  {
    id: 'tms-gm01',
    name: 'TMS GM01',
    description: 'Make your Wedding Day Memorable',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/2.png',
    productCount: 12,
  },
  {
    id: 'adedotun',
    name: 'Adedotun',
    description: 'Revel in the regal allure of traditional Nigerian styles',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/5.png',
    productCount: 18,
  },
  {
    id: 'urban-safari',
    name: 'Urban Safari',
    description: 'Conquer the street with Afro inspired modern casual wears',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/DSC03812.jpg',
    productCount: 15,
  },
];

export const categories = [
  {
    id: 'agbada',
    name: 'Agbada',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/5.png',
  },
  {
    id: 'casual-wears',
    name: 'Casual Wears',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/09/Casual-Wear.png',
  },
  {
    id: 'kaftan',
    name: 'Kaftan',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/4.png',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/1-1.png',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/09/Shoe.png',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/6.png',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'TMS Tanned Penny',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_1996.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_1996.JPG',
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_1998.JPG',
    ],
    category: 'shoes',
    hairType: 'Loafers',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Tan'],
    description: 'Premium tanned penny loafers crafted with the finest leather. Perfect for both formal and casual occasions.',
    careInstructions: ['Clean with a soft cloth', 'Apply leather conditioner regularly', 'Store with shoe trees'],
    rating: 4.9,
    reviews: 24,
    inStock: true,
    bestseller: true,
  },
  {
    id: '2',
    name: 'TMS Brown Suede Loafers',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2028.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2028.JPG',
    ],
    category: 'shoes',
    hairType: 'Loafers',
    laceType: 'Suede',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown'],
    description: 'Elegant brown suede loafers with exceptional comfort and style. A must-have for the modern gentleman.',
    careInstructions: ['Use suede brush for cleaning', 'Apply waterproof spray', 'Avoid wet conditions'],
    rating: 4.8,
    reviews: 18,
    inStock: true,
    bestseller: true,
  },
  {
    id: '3',
    name: 'TMS Black Straped Half Shoe',
    price: 50000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2036.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2036.JPG',
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2034.JPG',
    ],
    category: 'shoes',
    hairType: 'Half Shoe',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Black'],
    description: 'Stylish black half shoe with custom straps. Perfect for making a statement at any event.',
    careInstructions: ['Polish regularly', 'Store in dust bag', 'Use shoe horn when wearing'],
    rating: 4.7,
    reviews: 12,
    inStock: true,
    new: true,
  },
  {
    id: '4',
    name: 'TMS Black Penny with Custom Straps',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2037.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2037.JPG',
    ],
    category: 'shoes',
    hairType: 'Loafers',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Black'],
    description: 'Black penny loafers elevated with custom straps for a unique, sophisticated look.',
    careInstructions: ['Clean with a soft cloth', 'Apply leather conditioner regularly'],
    rating: 4.9,
    reviews: 32,
    inStock: true,
    bestseller: true,
  },
  {
    id: '5',
    name: 'TMS Brown Penny Loafers',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2042.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2042.JPG',
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2042-1.JPG',
    ],
    category: 'shoes',
    hairType: 'Loafers',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown'],
    description: 'Classic brown penny loafers with premium leather finishing. Timeless elegance for the discerning gentleman.',
    careInstructions: ['Clean with a soft cloth', 'Apply leather conditioner regularly', 'Store with shoe trees'],
    rating: 4.8,
    reviews: 28,
    inStock: true,
  },
  {
    id: '6',
    name: 'TMS Brown Party Shoe',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2047-1.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2047-1.JPG',
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2051.JPG',
    ],
    category: 'shoes',
    hairType: 'Party Shoes',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown'],
    description: 'Premium brown party shoes designed for special occasions. Stand out with signature Temmie craftsmanship.',
    careInstructions: ['Polish regularly', 'Store in dust bag'],
    rating: 4.7,
    reviews: 15,
    inStock: true,
    new: true,
  },
  {
    id: '7',
    name: 'TMS Blue Half Shoe',
    price: 30000,
    originalPrice: 40000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2061.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2061.JPG',
    ],
    category: 'shoes',
    hairType: 'Half Shoe',
    laceType: 'Suede',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Blue'],
    description: 'Unique blue half shoes in premium suede. A bold fashion statement for the style-conscious.',
    careInstructions: ['Use suede brush for cleaning', 'Apply waterproof spray'],
    rating: 4.6,
    reviews: 9,
    inStock: true,
  },
  {
    id: '8',
    name: 'TMS Brown Penny Shoes',
    price: 50000,
    originalPrice: 80000,
    image: 'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2055-1.JPG',
    images: [
      'https://temmiesignature.com/wp-content/uploads/2025/11/IMG_2055-1.JPG',
    ],
    category: 'shoes',
    hairType: 'Loafers',
    laceType: 'Leather',
    length: '',
    density: '',
    capSize: ['40', '41', '42', '43', '44', '45'],
    colors: ['Brown'],
    description: 'Signature brown penny shoes with exceptional craftsmanship. The perfect blend of comfort and style.',
    careInstructions: ['Clean with a soft cloth', 'Apply leather conditioner regularly'],
    rating: 4.8,
    reviews: 22,
    inStock: true,
    bestseller: true,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Adeola T.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    rating: 5,
    date: '2 weeks ago',
    content: 'The quality of these shoes is unmatched! I wore the TMS Tanned Penny to a wedding and got so many compliments. Will definitely order again!',
    productName: 'TMS Tanned Penny',
    verified: true,
  },
  {
    id: '2',
    author: 'Chukwudi K.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    rating: 5,
    date: '1 month ago',
    content: 'The Adedotun collection is magnificent. Traditional Nigerian fashion at its finest. The craftsmanship and attention to detail are incredible.',
    productName: 'Adedotun Collection',
    verified: true,
  },
  {
    id: '3',
    author: 'Oluwaseun R.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    rating: 5,
    date: '3 weeks ago',
    content: 'Fast shipping to Lagos and the agbada came beautifully packaged. It is now my go-to for special occasions. Absolutely love it!',
    productName: 'TMS GM01 Agbada',
    verified: true,
  },
  {
    id: '4',
    author: 'Babatunde M.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    rating: 5,
    date: '1 week ago',
    content: 'Exceeded my expectations! The Urban Safari collection is trendy yet rooted in African culture. Best fits indeed!',
    productName: 'Urban Safari Casual',
    verified: true,
  },
];

export const instagramPosts = [
  'https://temmiesignature.com/wp-content/uploads/2025/09/1-1.jpg',
  'https://temmiesignature.com/wp-content/uploads/2025/09/2-1.jpg',
  'https://temmiesignature.com/wp-content/uploads/2025/09/3.jpg',
  'https://temmiesignature.com/wp-content/uploads/2025/09/4.jpg',
  'https://temmiesignature.com/wp-content/uploads/2025/09/5.jpg',
  'https://temmiesignature.com/wp-content/uploads/2025/09/6.jpg',
];
