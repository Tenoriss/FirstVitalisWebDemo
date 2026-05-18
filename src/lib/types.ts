export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  role: "customer" | "admin";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
  description: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type OrderStatus = "Pending" | "Paid" | "Shipped" | "Completed";

export interface Order {
  id: string;
  invoiceNo: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  address: string;
  paymentMethod: "QRIS" | "Bank Transfer" | "E-Wallet";
  status: OrderStatus;
  createdAt: string;
}