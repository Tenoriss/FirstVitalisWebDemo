import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { register, verifyEmail } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = register(name, email, password);
    if (res.ok) {
      toast.success(res.message);
      setShowVerify(true);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-luxe animate-scale-in">
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-2 text-3xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join the Vitalis family</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password (min 6)</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-primary-gradient shadow-soft">Register</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
        </p>
      </div>

      <Dialog open={showVerify} onOpenChange={setShowVerify}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary-gradient">
              <MailCheck className="h-7 w-7 text-primary-foreground" />
            </div>
            <DialogTitle className="text-center">Email Verification Sent</DialogTitle>
            <DialogDescription className="text-center">
              Email verification link has been sent to <strong>{email}</strong>. Klik tombol di bawah untuk simulasi verifikasi.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="w-full bg-primary-gradient"
            onClick={() => {
              verifyEmail();
              setShowVerify(false);
              navigate({ to: "/" });
            }}
          >
            Verify Email
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}