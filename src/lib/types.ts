export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Dresses' | 'Accessories' | 'Combos';
  trending: boolean;
  description: string;
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
