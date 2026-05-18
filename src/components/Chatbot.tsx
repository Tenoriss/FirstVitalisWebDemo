import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Msg { from: "bot" | "user"; text: string; }

const KB: { match: RegExp; reply: string }[] = [
  { match: /produk|product|parfum|body/i, reply: "Kami menyediakan parfum & body care eksklusif Vitalis. Cek halaman Shop untuk koleksi lengkap." },
  { match: /kirim|shipping|pengiriman/i, reply: "Pengiriman 2-5 hari kerja ke seluruh Indonesia. Ongkir flat Rp 15.000." },
  { match: /bayar|payment|pembayaran/i, reply: "Pembayaran via QRIS, Bank Transfer, atau E-Wallet (OVO/DANA/GoPay)." },
  { match: /promo|diskon|sale/i, reply: "Dapatkan diskon hingga 20% untuk pembelian pertama. Gunakan kode VITALIS20." },
  { match: /hi|halo|hello/i, reply: "Halo! Saya Vita, asisten Vitalis. Ada yang bisa saya bantu? ✨" },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Halo! Saya Vita ✨ Asisten virtual Vitalis. Tanyakan tentang produk, pengiriman, atau pembayaran." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = KB.find((k) => k.match.test(text))?.reply
      || "Terima kasih atas pertanyaannya! Tim kami akan menghubungi Anda. Sementara itu, cek halaman Shop & FAQ.";
    setMsgs((m) => [...m, { from: "user", text }, { from: "bot", text: reply }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-gradient text-primary-foreground shadow-luxe transition-transform hover:scale-110"
        aria-label="Chatbot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border bg-card shadow-luxe animate-scale-in">
          <div className="flex items-center gap-2 bg-primary-gradient p-4 text-primary-foreground">
            <Sparkles className="h-5 w-5" />
            <div>
              <div className="font-semibold">Vita Assistant</div>
              <div className="text-xs opacity-90">Online · biasanya membalas instan</div>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Tulis pesan..."
            />
            <Button size="icon" onClick={send} className="bg-primary-gradient"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
}