
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
    description: 'A beautiful floral maxi dress, perfect for summer days. Made from lightweight, breathable fabric, it features a flattering V-neck and a cinched waist.',
    dataAiHint: 'floral dress',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
  },
  {
    id: '2',
    name: 'Classic Leather Handbag',
    price: 129.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Accessories',
    trending: false,
    description: 'A timeless leather handbag that complements any outfit. Features multiple compartments and a detachable shoulder strap.',
    dataAiHint: 'leather handbag',
    sizes: ['One Size'],
    stock: 20,
  },
  {
    id: '3',
    name: 'Weekend Getaway Combo',
    price: 199.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Combos',
    trending: true,
    description: 'A curated set for your next weekend adventure, including a comfortable top, versatile pants, and a stylish scarf.',
    dataAiHint: 'travel outfit',
    sizes: ['S', 'M', 'L'],
    stock: 8,
  },
  {
    id: '4',
    name: 'Striped Linen Shirt',
    price: 59.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Shirts',
    trending: true,
    description: 'A breathable linen shirt with a classic striped pattern. Perfect for a smart-casual look.',
    dataAiHint: 'linen shirt',
    sizes: ['M', 'L', 'XL'],
    stock: 12,
  },
  {
    id: '5',
    name: 'High-Waisted Skinny Jeans',
    price: 89.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Pants',
    trending: false,
    description: 'Flattering high-waisted skinny jeans for a sleek silhouette. Made with stretch denim for ultimate comfort.',
    dataAiHint: 'skinny jeans',
    sizes: ['28', '30', '32', '34'],
    stock: 25,
  },
  {
    id: '6',
    name: 'Performance Yoga Leggings',
    price: 69.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Sportswear',
    trending: true,
    description: 'Flexible and comfortable leggings for your yoga sessions. Features a high-rise waistband and moisture-wicking fabric.',
    dataAiHint: 'yoga leggings',
    sizes: ['S', 'M', 'L'],
    stock: 0,
  },
  {
    id: '7',
    name: 'Tailored Blazer',
    price: 149.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Formals',
    trending: false,
    description: 'A sharp, tailored blazer for professional settings. Fully lined with a single-button closure.',
    dataAiHint: 'tailored blazer',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 10,
  },
  {
    id: '8',
    name: 'Casual Denim Jacket',
    price: 99.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Casuals',
    trending: true,
    description: 'A versatile denim jacket for a relaxed, everyday look. Features classic button-front styling and side pockets.',
    dataAiHint: 'denim jacket',
    sizes: ['S', 'M', 'L'],
    stock: 18,
  },
   {
    id: '9',
    name: 'Silk Evening Gown',
    price: 249.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Dresses',
    trending: false,
    description: 'An exquisite silk evening gown for special occasions. Features a floor-length design and intricate beadwork.',
    dataAiHint: 'evening gown',
    sizes: ['S', 'M', 'L'],
    stock: 5,
  },
  {
    id: '10',
    name: 'Chunky Knit Sweater',
    price: 75.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Casuals',
    trending: true,
    description: 'A cozy and stylish chunky knit sweater for cooler days. Made from a soft wool blend.',
    dataAiHint: 'knit sweater',
    sizes: ['One Size'],
    stock: 14,
  },
  {
    id: '11',
    name: 'Athletic Performance Tee',
    price: 45.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Sportswear',
    trending: false,
    description: 'A lightweight and breathable tee for your workouts, designed to keep you cool and dry.',
    dataAiHint: 'athletic tee',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
  },
  {
    id: '12',
    name: 'Pleated A-Line Skirt',
    price: 65.00,
    image: 'https://placehold.co/600x800.png',
    category: 'Formals',
    trending: true,
    description: 'A classic pleated A-line skirt for a touch of elegance. Falls just below the knee.',
    dataAiHint: 'pleated skirt',
    sizes: ['S', 'M', 'L'],
    stock: 9,
  },
  {
    id: '13',
    name: 'Branded Logo T-Shirt',
    price: 49.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Branded',
    trending: true,
    description: 'A stylish t-shirt featuring our exclusive brand logo. Made from 100% premium cotton.',
    dataAiHint: 'logo t-shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
  },
  {
    id: '14',
    name: 'Branded Performance Shorts',
    price: 55.99,
    image: 'https://placehold.co/600x800.png',
    category: 'Branded',
    trending: false,
    description: 'High-performance shorts with subtle branding, perfect for workouts or casual wear.',
    dataAiHint: 'branded shorts',
    sizes: ['S', 'M', 'L'],
    stock: 22,
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
