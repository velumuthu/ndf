export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Dresses' | 'Accessories' | 'Combos' | 'Shirts' | 'Pants' | 'Sportswear' | 'Formals' | 'Casuals';
  trending: boolean;
  description: string;
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
