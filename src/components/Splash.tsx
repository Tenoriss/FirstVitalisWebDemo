import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function Splash() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-hero-gradient animate-fade-in">
      <div className="flex flex-col items-center gap-4 animate-scale-in">
        <div className="flex items-center gap-2">
          <Sparkles className="h-10 w-10 text-primary animate-float" />
          <span className="font-serif text-5xl font-bold text-gradient" style={{ fontFamily: "'Playfair Display', serif" }}>
            Vitalis
          </span>
        </div>
        <p className="text-sm tracking-[0.3em] text-muted-foreground">BEAUTY · COMMERCE</p>
        <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-[slide_1.2s_ease-in-out_infinite] bg-primary-gradient" />
        </div>
      </div>
      <style>{`@keyframes slide{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  );
}