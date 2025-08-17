
import type { User as FirebaseUser } from 'firebase/auth';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Dresses' | 'Accessories' | 'Combos' | 'Shirts' | 'Pants' | 'Sportswear' | 'Formals' | 'Casuals' | 'Branded';
  trending: boolean;
  description: string;
  dataAiHint: string;
  sizes: string[];
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
};

export type User = {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'customer';
};

export type UserDetails = User;

export type Order = {
  id?: string;
  cart: CartItem[];
  totalPrice: number;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  status: string;
  createdAt: any;
  userId?: string | null;
}

export type BulkOrder = {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    quantity: number;
    deliveryDate?: string;
    message: string;
    createdAt: any;
}

export type Offer = {
    id: string;
    title: string;
    description: string;
    couponCode: string;
    discountPercentage: number;
    active: boolean;
}

export type Notification = {
    id: string;
    message: string;
    active: boolean;
}

export type StylistInquiry = {
    id: string;
    name: string;
    email: string;
    occasion: string;
    message: string;
    createdAt: any;
}

export type AuthContextType = {
  user: FirebaseUser | null;
  userDetails: UserDetails | null;
  loading: boolean;
  logout: () => Promise<void>;
};
