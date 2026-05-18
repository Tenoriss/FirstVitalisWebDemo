import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Shield, Truck, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/contexts/AppContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { products } = useApp();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container mx-auto grid gap-8 px-4 py-20 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center gap-6 animate-fade-up">
            <span className="inline-flex w-fit items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              NEW · Limited Edition Collection
            </span>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Elegant Beauty,
              <br />
              <span className="text-gradient">Timeless Fragrance</span>
            </h1>

            <p className="max-w-md text-lg text-muted-foreground">
              Discover the world of Vitalis — koleksi parfum dan body care
              eksklusif yang menemani setiap momen istimewa Anda.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-primary-gradient shadow-luxe transition-transform hover:scale-[1.02]"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/products">
                <Button size="lg" variant="outline">
                  Explore Bestseller
                </Button>
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <span className="text-muted-foreground">
                4.9 · 12,000+ happy customers
              </span>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-accent/40 blur-2xl" />

            <img
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=80&auto=format&fit=crop"
              alt="Vitalis Hero"
              loading="eager"
              decoding="async"
              className="relative mx-auto h-[500px] w-full max-w-md rounded-3xl object-cover shadow-luxe animate-float will-change-transform"
            />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            Why Choose <span className="text-gradient">Vitalis</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Kualitas premium yang dipercaya jutaan wanita Indonesia
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "100% Authentic",
              desc: "Produk asli langsung dari pabrik resmi Vitalis.",
            },
            {
              icon: Truck,
              title: "Fast Shipping",
              desc: "Pengiriman cepat 2-5 hari ke seluruh Indonesia.",
            },
            {
              icon: Heart,
              title: "Loved by Millions",
              desc: "Brand favorit yang telah dipercaya sejak lama.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-card p-8 text-center hover-lift"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground">
                <f.icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container mx-auto px-4 py-12 animate-fade-up">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              Koleksi pilihan paling diminati
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/30 py-20 animate-fade-up">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">
              What Our <span className="text-gradient">Customers</span> Say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Sarah W.",
                text: "Wanginya tahan lama dan elegan banget! Sudah jadi parfum harian saya.",
                role: "Verified Buyer",
              },
              {
                name: "Dewi M.",
                text: "Body mistnya bikin segar sepanjang hari. Love it!",
                role: "Verified Buyer",
              },
              {
                name: "Anisa R.",
                text: "Pengiriman cepat, packaging cantik. Recommended!",
                role: "Verified Buyer",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border bg-card p-6 hover-lift"
              >
                <div className="mb-3 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                <p className="text-sm">"{t.text}"</p>

                <div className="mt-4">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}