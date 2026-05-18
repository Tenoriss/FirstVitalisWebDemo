import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  cartStore,
  initStore,
  ordersStore,
  productsStore,
  session,
  usersStore,
} from "@/lib/store";
import type { CartItem, Order, Product, User } from "@/lib/types";

interface AppContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  verifyEmail: () => void;
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartProducts: (CartItem & { product: Product })[];
  cartTotal: number;
  products: Product[];
  refreshProducts: () => void;
  orders: Order[];
  refreshOrders: () => void;
  placeOrder: (data: {
    address: string;
    paymentMethod: Order["paymentMethod"];
  }) => Order | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    initStore();
    const sid = session.get();
    if (sid) {
      const u = usersStore.all().find((x) => x.id === sid) || null;
      setUser(u);
      if (u) setCart(cartStore.get(u.id));
    }
    setProducts(productsStore.all());
    setOrders(ordersStore.all());
  }, []);

  // persist cart
  useEffect(() => {
    if (user) cartStore.set(user.id, cart);
  }, [cart, user]);

  const refreshProducts = () => setProducts(productsStore.all());
  const refreshOrders = () => setOrders(ordersStore.all());

  const login: AppContextValue["login"] = (email, password) => {
    const u = usersStore.findByEmail(email);
    if (!u) return { ok: false, message: "Email tidak terdaftar" };
    if (u.password !== password) return { ok: false, message: "Password salah" };
    session.set(u.id);
    setUser(u);
    setCart(cartStore.get(u.id));
    return { ok: true, message: "Login berhasil" };
  };

  const register: AppContextValue["register"] = (name, email, password) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, message: "Format email tidak valid" };
    if (password.length < 6) return { ok: false, message: "Password minimal 6 karakter" };
    if (usersStore.findByEmail(email))
      return { ok: false, message: "Email sudah terdaftar" };
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      verified: false,
      role: "customer",
    };
    usersStore.add(newUser);
    session.set(newUser.id);
    setUser(newUser);
    setCart([]);
    return { ok: true, message: "Registrasi berhasil" };
  };

  const verifyEmail = () => {
    if (!user) return;
    const updated = { ...user, verified: true };
    usersStore.update(updated);
    setUser(updated);
    toast.success("Email berhasil diverifikasi");
  };

  const logout = () => {
    session.clear();
    setUser(null);
    setCart([]);
  };

  const addToCart = (productId: string, qty = 1) => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }
    if (user.role === "admin") {
      toast.error("Admin tidak dapat berbelanja");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) =>
          c.productId === productId ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { productId, qty }];
    });
    toast.success("Ditambahkan ke keranjang");
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, qty } : c)));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const cartProducts = useMemo(
    () =>
      cart
        .map((c) => {
          const product = products.find((p) => p.id === c.productId);
          return product ? { ...c, product } : null;
        })
        .filter(Boolean) as (CartItem & { product: Product })[],
    [cart, products]
  );

  const cartTotal = useMemo(
    () => cartProducts.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cartProducts]
  );

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  const placeOrder: AppContextValue["placeOrder"] = ({ address, paymentMethod }) => {
    if (!user || cartProducts.length === 0) return null;
    // decrement stock
    const updatedProducts = productsStore.all().map((p) => {
      const item = cartProducts.find((c) => c.productId === p.id);
      if (!item) return p;
      return { ...p, stock: Math.max(0, p.stock - item.qty) };
    });
    productsStore.save(updatedProducts);
    setProducts(updatedProducts);

    const subtotal = cartTotal;
    const shipping = 15000;
    const order: Order = {
      id: crypto.randomUUID(),
      invoiceNo: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(Math.random() * 90000 + 10000)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: cartProducts.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        qty: c.qty,
        image: c.product.image,
      })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      address,
      paymentMethod,
      status: "Paid",
      createdAt: new Date().toISOString(),
    };
    ordersStore.add(order);
    setOrders(ordersStore.all());
    clearCart();
    return order;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        verifyEmail,
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartProducts,
        cartTotal,
        products,
        refreshProducts,
        orders,
        refreshOrders,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}