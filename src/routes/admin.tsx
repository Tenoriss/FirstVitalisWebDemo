import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, Receipt } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const { user } = useApp();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (user && user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p>Login sebagai admin untuk mengakses halaman ini.</p>
        <Link to="/login" className="mt-4 inline-block text-primary hover:underline">Sign In</Link>
      </div>
    );
  }
  if (user.role !== "admin") return null;

  const links = [
    { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products" as const, label: "Products", icon: Package },
    { to: "/admin/transactions" as const, label: "Transactions", icon: Receipt },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border bg-card p-4">
          <h2 className="mb-4 px-2 font-serif text-xl font-bold text-gradient" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Panel</h2>
          <nav className="space-y-1">
            {links.map((l) => {
              const active = l.exact ? loc.pathname === l.to : loc.pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary-gradient text-primary-foreground" : "hover:bg-secondary"}`}>
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}