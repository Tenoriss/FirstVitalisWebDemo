import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { formatIDR } from "@/lib/store";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { cartProducts, cartTotal, updateQty, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Silakan login terlebih dahulu</h1>
        <Link to="/login"><Button className="mt-4 bg-primary-gradient">Sign In</Button></Link>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center animate-fade-in">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Keranjang Anda kosong</h1>
        <Link to="/products"><Button className="mt-6 bg-primary-gradient">Mulai Belanja</Button></Link>
      </div>
    );
  }

  const shipping = 15000;

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="mb-8 text-4xl font-bold">Shopping <span className="text-gradient">Cart</span></h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartProducts.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border bg-card p-4 hover-lift">
              <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="mt-auto font-bold text-gradient">{formatIDR(item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="flex items-center rounded-full border">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.productId, item.qty - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQty(item.productId, Math.min(item.product.stock, item.qty + 1))}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(cartTotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatIDR(shipping)}</span></div>
            <div className="my-3 border-t" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-gradient">{formatIDR(cartTotal + shipping)}</span></div>
          </div>
          <Button className="mt-6 w-full bg-primary-gradient shadow-luxe" size="lg" onClick={() => navigate({ to: "/checkout" })}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}