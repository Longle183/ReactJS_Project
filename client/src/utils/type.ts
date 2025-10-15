export interface Product {
  product_name: string | undefined;
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Discount {
  id: number;
  name: string;
  price: number;
  image: string;
}
