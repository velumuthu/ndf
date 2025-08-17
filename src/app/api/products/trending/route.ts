
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

export async function GET() {
  try {
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, where("trending", "==", true));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json({ error: 'Failed to fetch trending products' }, { status: 500 });
  }
}
