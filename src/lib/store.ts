import type { Product, User, Order, CartItem } from "./types";

const KEYS = {
  users: "vitalis_users",
  session: "vitalis_session",
  products: "vitalis_products",
  cart: "vitalis_cart",
  orders: "vitalis_orders",
} as const;

const isBrowser = () => typeof window !== "undefined";

const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  if (cache.has(key)) {
    return cache.get(key) as T;
  }

  try {
    const raw = localStorage.getItem(key);
    const value = raw ? (JSON.parse(raw) as T) : fallback;
    cache.set(key, value);
    return value;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  cache.set(key, value);
  localStorage.setItem(key, JSON.stringify(value));
}

const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Vitalis Eau de Parfum — Glamorous",
    category: "Parfum",
    price: 89000,
    stock: 42,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80&auto=format&fit=crop",
    description:
      "Aroma floral elegan dengan sentuhan musk lembut. Tahan lama untuk aktivitas sepanjang hari.",
    featured: true,
  },
  {
    id: "p2",
    name: "Vitalis Body Mist — White Glow",
    category: "Body Mist",
    price: 39000,
    stock: 80,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80&auto=format&fit=crop",
    description:
      "Body mist ringan dengan wangi floral romantis dan brightening essence.",
    featured: true,
  },
  {
    id: "p3",
    name: "Vitalis Body Wash — Rose Garden",
    category: "Body Care",
    price: 29000,
    stock: 60,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&auto=format&fit=crop",
    description:
      "Body wash lembut dengan ekstrak mawar yang melembapkan kulit.",
    featured: true,
  },
  {
    id: "p4",
    name: "Vitalis Hand & Body Lotion — Sakura",
    category: "Body Care",
    price: 34000,
    stock: 50,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80&auto=format&fit=crop",
    description:
      "Lotion dengan aroma sakura yang menutrisi kulit dengan vitamin E.",
  },
  {
    id: "p5",
    name: "Vitalis Eau de Cologne — Fresh Daisy",
    category: "Parfum",
    price: 75000,
    stock: 30,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80&auto=format&fit=crop",
    description:
      "Eau de cologne segar dengan top notes citrus dan daisy floral.",
    featured: true,
  },
  {
    id: "p6",
    name: "Vitalis Body Scrub — Coconut Honey",
    category: "Body Care",
    price: 42000,
    stock: 25,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80&auto=format&fit=crop",
    description:
      "Scrub eksfoliasi dengan butiran kelapa & madu untuk kulit halus bercahaya.",
  },
  {
    id: "p7",
    name: "Vitalis Perfumed Talc — Soft Beauty",
    category: "Body Care",
    price: 22000,
    stock: 100,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1599733589046-8a35aaff8d11?w=800&q=80&auto=format&fit=crop",
    description:
      "Bedak tabur wangi yang menyerap minyak dan memberikan aroma tahan lama.",
  },
  {
    id: "p8",
    name: "Vitalis Roll-On Deodorant — Pure",
    category: "Body Care",
    price: 18000,
    stock: 120,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&q=80&auto=format&fit=crop",
    description:
      "Deodorant roll-on yang menjaga kesegaran ketiak sepanjang hari.",
  },
];

const ADMIN_USER: User = {
  id: "admin",
  name: "Vitalis Admin",
  email: "admin@vitalis.com",
  password: "admin123",
  verified: true,
  role: "admin",
};

export function initStore() {
  if (!isBrowser()) return;

  const users = read<User[]>(KEYS.users, []);

  if (!users.find((u) => u.email === ADMIN_USER.email)) {
    write(KEYS.users, [...users, ADMIN_USER]);
  }

  const products = read<Product[]>(KEYS.products, []);

  if (products.length === 0) {
    write(KEYS.products, SEED_PRODUCTS);
  }
}

export const usersStore = {
  all: () => read<User[]>(KEYS.users, []),

  add: (user: User) => {
    const users = usersStore.all();
    write(KEYS.users, [...users, user]);
  },

  update: (user: User) => {
    write(
      KEYS.users,
      usersStore.all().map((item) => (item.id === user.id ? user : item))
    );
  },

  findByEmail: (email: string) =>
    usersStore
      .all()
      .find((user) => user.email.toLowerCase() === email.toLowerCase()),
};

export const session = {
  get: () => read<string | null>(KEYS.session, null),

  set: (userId: string | null) => {
    write(KEYS.session, userId);
  },

  clear: () => {
    write(KEYS.session, null);
  },
};

export const productsStore = {
  all: () => read<Product[]>(KEYS.products, []),

  save: (products: Product[]) => {
    write(KEYS.products, products);
  },

  add: (product: Product) => {
    productsStore.save([...productsStore.all(), product]);
  },

  update: (product: Product) => {
    productsStore.save(
      productsStore
        .all()
        .map((item) => (item.id === product.id ? product : item))
    );
  },

  remove: (id: string) => {
    productsStore.save(productsStore.all().filter((item) => item.id !== id));
  },

  get: (id: string) => productsStore.all().find((item) => item.id === id),
};

export const cartStore = {
  key: (userId: string) => `${KEYS.cart}_${userId}`,

  get: (userId: string) => read<CartItem[]>(cartStore.key(userId), []),

  set: (userId: string, items: CartItem[]) => {
    write(cartStore.key(userId), items);
  },

  clear: (userId: string) => {
    write(cartStore.key(userId), []);
  },
};

export const ordersStore = {
  all: () => read<Order[]>(KEYS.orders, []),

  save: (orders: Order[]) => {
    write(KEYS.orders, orders);
  },

  add: (order: Order) => {
    ordersStore.save([order, ...ordersStore.all()]);
  },

  update: (order: Order) => {
    ordersStore.save(
      ordersStore.all().map((item) => (item.id === order.id ? order : item))
    );
  },

  byUser: (userId: string) =>
    ordersStore.all().filter((order) => order.userId === userId),
};

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const genInvoiceNo = () =>
  `INV-${new Date().getFullYear()}${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${Math.floor(Math.random() * 90000 + 10000)}`;