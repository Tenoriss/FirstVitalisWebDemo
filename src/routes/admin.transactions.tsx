import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { formatIDR, ordersStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/transactions")({ component: AdminTransactions });

const STATUSES: OrderStatus[] = ["Pending", "Paid", "Shipped", "Completed"];
const colors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
};

function AdminTransactions() {
  const { orders, refreshOrders } = useApp();

  const updateStatus = (id: string, status: OrderStatus) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    ordersStore.update({ ...o, status });
    refreshOrders();
    toast.success("Status diperbarui");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Transactions</h1>
      {orders.length === 0 ? (
        <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{o.invoiceNo}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {o.userName} · {o.userEmail} · {new Date(o.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gradient">{formatIDR(o.total)}</span>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">Items:</p>
                  <ul className="ml-4 list-disc text-muted-foreground">
                    {o.items.map((i) => <li key={i.productId}>{i.name} x{i.qty}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Address:</p>
                  <p className="whitespace-pre-line text-muted-foreground">{o.address}</p>
                  <p className="mt-1 text-muted-foreground">Payment: {o.paymentMethod}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}