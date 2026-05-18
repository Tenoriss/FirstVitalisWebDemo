import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Package, DollarSign, AlertTriangle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { formatIDR, usersStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const { orders, products } = useApp();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const customers = usersStore.all().filter((u) => u.role === "customer").length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  const soldMap = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((i) => soldMap.set(i.name, (soldMap.get(i.name) || 0) + i.qty)));
  const best = [...soldMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const days: { date: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const revenue = orders.filter((o) => o.createdAt.slice(0, 10) === key).reduce((s, o) => s + o.total, 0);
    days.push({ date: d.toLocaleDateString("id-ID", { weekday: "short" }), revenue });
  }

  const lowStock = products.filter((p) => p.stock < 20);

  const stats = [
    { label: "Total Revenue", value: formatIDR(totalRevenue), icon: DollarSign },
    { label: "Total Orders", value: orders.length, icon: TrendingUp },
    { label: "Customers", value: customers, icon: Users },
    { label: "Total Stock", value: totalStock, icon: Package },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-semibold">Revenue · Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={days}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatIDR(v)} />
              <Bar dataKey="revenue" fill="#e8688a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-semibold">Bestsellers</h2>
          {best.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada penjualan.</p>
          ) : (
            <ul className="space-y-3">
              {best.map(([name, qty], i) => (
                <li key={name} className="flex items-center justify-between text-sm">
                  <span><span className="font-semibold text-primary">#{i + 1}</span> {name}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{qty} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
          <div className="flex items-center gap-2 font-semibold text-yellow-800">
            <AlertTriangle className="h-5 w-5" /> Low Stock Warning
          </div>
          <ul className="mt-2 space-y-1 text-sm text-yellow-800">
            {lowStock.map((p) => <li key={p.id}>{p.name} — {p.stock} tersisa</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}