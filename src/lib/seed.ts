
import { db } from './firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const products = [
  {
    id: '1',
    name: 'Elegant Floral Maxi Dress',
    price: 79.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Dresses',
    trending: true,
    description: 'A beautiful floral maxi dress, perfect for summer days.',
    dataAiHint: 'floral dress',
  },
  {
    id: '2',
    name: 'Classic Leather Handbag',
    price: 129.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Accessories',
    trending: false,
    description: 'A timeless leather handbag that complements any outfit.',
    dataAiHint: 'leather handbag',
  },
  {
    id: '3',
    name: 'Weekend Getaway Combo',
    price: 199.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Combos',
    trending: true,
    description: 'A curated set for your next weekend adventure.',
    dataAiHint: 'travel outfit',
  },
  {
    id: '4',
    name: 'Striped Linen Shirt',
    price: 59.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Shirts',
    trending: true,
    description: 'A breathable linen shirt with a classic striped pattern.',
    dataAiHint: 'linen shirt',
  },
  {
    id: '5',
    name: 'High-Waisted Skinny Jeans',
    price: 89.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Pants',
    trending: false,
    description: 'Flattering high-waisted skinny jeans for a sleek silhouette.',
    dataAiHint: 'skinny jeans',
  },
  {
    id: '6',
    name: 'Performance Yoga Leggings',
    price: 69.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Sportswear',
    trending: true,
    description: 'Flexible and comfortable leggings for your yoga sessions.',
    dataAiHint: 'yoga leggings',
  },
  {
    id: '7',
    name: 'Tailored Blazer',
    price: 149.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Formals',
    trending: false,
    description: 'A sharp, tailored blazer for professional settings.',
    dataAiHint: 'tailored blazer',
  },
  {
    id: '8',
    name: 'Casual Denim Jacket',
    price: 99.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Casuals',
    trending: true,
    description: 'A versatile denim jacket for a relaxed, everyday look.',
    dataAiHint: 'denim jacket',
  },
   {
    id: '9',
    name: 'Silk Evening Gown',
    price: 249.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Dresses',
    trending: false,
    description: 'An exquisite silk evening gown for special occasions.',
    dataAiHint: 'evening gown'
  },
  {
    id: '10',
    name: 'Chunky Knit Sweater',
    price: 75.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Casuals',
    trending: true,
    description: 'A cozy and stylish chunky knit sweater for cooler days.',
    dataAiHint: 'knit sweater'
  },
  {
    id: '11',
    name: 'Athletic Performance Tee',
    price: 45.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Sportswear',
    trending: false,
    description: 'A lightweight and breathable tee for your workouts.',
    dataAiHint: 'athletic tee'
  },
  {
    id: '12',
    name: 'Pleated A-Line Skirt',
    price: 65.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Formals',
    trending: true,
    description: 'A classic pleated A-line skirt for a touch of elegance.',
    dataAiHint: 'pleated skirt'
  },
  {
    id: '13',
    name: 'Branded Logo T-Shirt',
    price: 49.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Branded',
    trending: true,
    description: 'A stylish t-shirt featuring our exclusive brand logo.',
    dataAiHint: 'logo t-shirt'
  },
  {
    id: '14',
    name: 'Branded Performance Shorts',
    price: 55.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Branded',
    trending: false,
    description: 'High-performance shorts with subtle branding, perfect for workouts.',
    dataAiHint: 'branded shorts'
  }
];

export async function seedProducts() {
  console.log('Seeding products...');
  for (const product of products) {
    try {
      // Use the product's own id when creating the document
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, product);
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }
  console.log('Finished seeding products.');
}

// You can create a simple script to run this function, e.g., in a `scripts/seed.ts` file
// and run it with `npx tsx scripts/seed.ts`
// Make sure to configure your environment to connect to firebase-admin or use a client-side script on a temporary page.
// For this project, you can call this from a temporary component/page for simplicity.
// For example, add a button on the admin page to trigger this seeding.