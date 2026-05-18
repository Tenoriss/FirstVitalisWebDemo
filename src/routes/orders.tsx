import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { formatIDR } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
};

function OrdersPage() {
  const { orders, user } = useApp();
  if (!user) return <div className="container mx-auto py-20 text-center"><Link to="/login"><Button>Sign In</Button></Link></div>;

  const myOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="mb-8 text-4xl font-bold">My <span className="text-gradient">Orders</span></h1>
      {myOrders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Belum ada riwayat transaksi</p>
          <Link to="/products"><Button className="mt-4 bg-primary-gradient">Mulai Belanja</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-card p-6 hover-lift">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{o.invoiceNo}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("id-ID")}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[o.status]}`}>{o.status}</span>
              </div>
              <div className="mt-4 space-y-2">
                {o.items.map((i) => (
                  <div key={i.productId} className="flex items-center gap-3 text-sm">
                    <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">{i.name} <span className="text-muted-foreground">x{i.qty}</span></div>
                    <span>{formatIDR(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t pt-3 font-semibold">
                <span>Total ({o.paymentMethod})</span>
                <span className="text-gradient">{formatIDR(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}