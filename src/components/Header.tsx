import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, User as UserIcon, LogOut, Sparkles, LayoutDashboard } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-serif text-2xl font-bold text-gradient" style={{ fontFamily: "'Playfair Display', serif" }}>
            Vitalis
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
          {user && !isAdmin && (
            <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">My Orders</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-gradient text-xs font-semibold text-primary-foreground animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate({ to: "/orders" })}>
                    <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate({ to: "/login" })} className="bg-primary-gradient shadow-soft">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}