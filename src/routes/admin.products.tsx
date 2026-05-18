import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { productsStore, formatIDR } from "@/lib/store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

const empty: Product = { id: "", name: "", category: "Parfum", price: 0, stock: 0, rating: 4.5, image: "", description: "" };

function AdminProducts() {
  const { products, refreshProducts } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Product>(empty);

  const openNew = () => { setForm({ ...empty, id: "" }); setOpen(true); };
  const openEdit = (p: Product) => { setForm(p); setOpen(true); };

  const save = () => {
    if (!form.name || form.price <= 0) { toast.error("Lengkapi data produk"); return; }
    const data: Product = {
      ...form,
      id: form.id || crypto.randomUUID(),
      image: form.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    };
    if (form.id) productsStore.update(data); else productsStore.add(data);
    refreshProducts();
    setOpen(false);
    toast.success("Produk tersimpan");
  };

  const remove = (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    productsStore.remove(id);
    refreshProducts();
    toast.success("Produk dihapus");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={openNew} className="bg-primary-gradient shadow-soft">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatIDR(p.price)}</td>
                <td className="p-3">
                  <span className={p.stock < 20 ? "font-semibold text-destructive" : ""}>{p.stock}</span>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{form.id ? "Edit" : "Tambah"} Produk</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nama</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Kategori</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Rating</Label><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Harga (IDR)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div><Label>Stok</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></div>
            </div>
            <div><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} className="bg-primary-gradient">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}