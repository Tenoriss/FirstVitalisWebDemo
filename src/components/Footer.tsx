import { Sparkles, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/30">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-serif text-2xl font-bold text-gradient" style={{ fontFamily: "'Playfair Display', serif" }}>Vitalis</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Elegant beauty, timeless fragrance. Official ecommerce platform.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/products" className="hover:text-primary">Parfum</Link></li>
            <li><Link to="/products" className="hover:text-primary">Body Care</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>FAQ</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Follow Us</h4>
          <div className="flex gap-3">
            <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
            <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
            <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vitalis Beauty Commerce. All rights reserved.
      </div>
    </footer>
  );
}