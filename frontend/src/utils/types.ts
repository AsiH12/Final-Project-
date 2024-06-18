export type User = {
  id?: number;
  username: string;
  password?: string;
  confirmPassword?: string;
  email: string;
  age?: number;
};

export type Shop = {
  id?: number;
  name: string;
  description: string;
  owner_id?: number;
  categories?: string[];
  managers?: string[];
  role?: string;
};

export type Product = {
  id?: number;
  name: string;
  description?: string;
  shop_id?: number;
  shop_name?: string;
  price?: number;
  amount?: number;
  maximum_discount?: number;
  categories?: string[];
  image?: any;
};

export type Category = {
  id?: number;
  category_name: string;
};

export type Address = {
  id?: number;
  address: string;
  city: string;
  country: string;
  user_id?: number | string;

};

// Define type for items in the cart
export type CartItem = {
  id?: string;
  product_id?: number;
  description?: string;
  name: string;
  shop: string;
  image: string;
  price: number;
  amount: number;
  max_amount: number;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  categories?: string[];
  shop_id?: number;
};
