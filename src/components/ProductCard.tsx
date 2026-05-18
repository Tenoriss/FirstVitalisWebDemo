import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/types";
import { formatIDR } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useApp();
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card hover-lift">
      <Link to="/products/$id" params={{ id: product.id }} className="block aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</span>
        <Link to="/products/$id" params={{ id: product.id }} className="line-clamp-2 font-semibold hover:text-primary">
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span>{product.rating}</span>
          <span className="text-muted-foreground">· {product.stock} stok</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-gradient">{formatIDR(product.price)}</span>
        </div>
        <Button
          onClick={() => addToCart(product.id)}
          disabled={product.stock === 0}
          className="bg-primary-gradient shadow-soft"
        >
          {product.stock === 0 ? "Habis" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}