import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, QrCode, Wallet, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { formatIDR } from "@/lib/store";
import type { Order } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { cartProducts, cartTotal, user, placeOrder } = useApp();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<Order["paymentMethod"]>("QRIS");
  const [order, setOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!user) {
    return <div className="container mx-auto py-20 text-center"><Link to="/login"><Button>Sign In</Button></Link></div>;
  }
  if (cartProducts.length === 0 && !order) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p>Cart kosong</p>
        <Link to="/products"><Button className="mt-4">Shop</Button></Link>
      </div>
    );
  }

  const shipping = 15000;

  const pay = () => {
    if (!address.trim() || !phone.trim()) { toast.error("Lengkapi alamat dan nomor telepon"); return; }
    setProcessing(true);
    setTimeout(() => {
      const o = placeOrder({ address: `${name} - ${phone}\n${address}`, paymentMethod: method });
      if (o) { setOrder(o); toast.success("Pembayaran berhasil!"); }
      setProcessing(false);
    }, 1200);
  };

  const downloadInvoice = () => {
    if (!order) return;
    const content = `VITALIS BEAUTY COMMERCE\n========================\nInvoice: ${order.invoiceNo}\nDate: ${new Date(order.createdAt).toLocaleString("id-ID")}\nCustomer: ${order.userName} (${order.userEmail})\nAddress: ${order.address}\nPayment: ${order.paymentMethod} - ${order.status}\n\nItems:\n${order.items.map((i) => `  ${i.name} x${i.qty} = ${formatIDR(i.price * i.qty)}`).join("\n")}\n\nSubtotal: ${formatIDR(order.subtotal)}\nShipping: ${formatIDR(order.shipping)}\nTOTAL: ${formatIDR(order.total)}\n\nThank you for shopping with Vitalis!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${order.invoiceNo}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const methods = [
    { id: "QRIS" as const, icon: QrCode, label: "QRIS" },
    { id: "Bank Transfer" as const, icon: CreditCard, label: "Bank Transfer" },
    { id: "E-Wallet" as const, icon: Wallet, label: "E-Wallet" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="mb-8 text-4xl font-bold">Check<span className="text-gradient">out</span></h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Nama</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>No. Telepon</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxx" /></div>
            </div>
            <div className="mt-4"><Label>Alamat Lengkap</Label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. ..." rows={3} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${method === m.id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <m.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {cartProducts.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span className="text-muted-foreground">{i.product.name} x{i.qty}</span>
                <span>{formatIDR(i.product.price * i.qty)}</span>
              </div>
            ))}
            <div className="my-3 border-t" />
            <div className="flex justify-between"><span>Subtotal</span><span>{formatIDR(cartTotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatIDR(shipping)}</span></div>
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-gradient">{formatIDR(cartTotal + shipping)}</span></div>
          </div>
          <Button className="mt-6 w-full bg-primary-gradient shadow-luxe" size="lg" onClick={pay} disabled={processing}>
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>

      <Dialog open={!!order} onOpenChange={(o) => { if (!o) { setOrder(null); navigate({ to: "/orders" }); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary-gradient">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <DialogTitle className="text-center text-2xl">Payment Successful</DialogTitle>
          </DialogHeader>
          {order && (
            <div className="space-y-2 rounded-xl bg-secondary/50 p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><strong>{order.invoiceNo}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{order.userName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">PAID</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-gradient">{formatIDR(order.total)}</span></div>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={downloadInvoice}>
              <Download className="mr-2 h-4 w-4" /> Download Invoice
            </Button>
            <Button className="flex-1 bg-primary-gradient" onClick={() => navigate({ to: "/orders" })}>View Orders</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}