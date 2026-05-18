import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Star, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { formatIDR } from "@/lib/store";

export const Route = createFileRoute("/products/$id")({ component: ProductDetail });

function ProductDetail() {
  const { id } = Route.useParams();
  const { products, addToCart } = useApp();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">← Kembali ke katalog</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient p-8 shadow-luxe">
          <img src={product.image} alt={product.name} className="mx-auto h-[500px] w-full rounded-2xl object-cover animate-float" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</span>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.stock} in stock</span>
          </div>
          <p className="text-3xl font-bold text-gradient">{formatIDR(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center rounded-full border">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button size="lg" className="flex-1 bg-primary-gradient shadow-luxe" disabled={product.stock === 0}
              onClick={() => { addToCart(product.id, qty); navigate({ to: "/cart" }); }}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}