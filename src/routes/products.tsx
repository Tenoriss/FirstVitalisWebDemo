import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/contexts/AppContext";

export const Route = createFileRoute("/products")({ component: ProductsPage });

function ProductsPage() {
  const { products } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search, category]
  );

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Our <span className="text-gradient">Collection</span></h1>
        <p className="mt-2 text-muted-foreground">Temukan parfum dan body care pilihan terbaik</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)} className={category === c ? "bg-primary-gradient" : ""}>
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {filtered.length === 0 && <p className="py-16 text-center text-muted-foreground">Tidak ada produk ditemukan.</p>}
    </div>
  );
}