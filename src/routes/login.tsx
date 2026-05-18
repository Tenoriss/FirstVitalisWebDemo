import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const res = login(email.trim(), password);

      if (res.ok) {
        toast.success(res.message);

        const isAdmin = email.trim().toLowerCase() === "admin@vitalis.com";
        navigate({ to: isAdmin ? "/admin" : "/" });
      } else {
        toast.error(res.message);
      }
    },
    [email, password, login, navigate]
  );

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-luxe">
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue shopping
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-primary-gradient shadow-soft">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
          <strong>Demo Admin:</strong> admin@vitalis.com / admin123
        </div>
      </div>
    </div>
  );
}