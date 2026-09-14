import { ArrowRight, Truck, Leaf, ShieldCheck, Clock } from "lucide-react";
import { Reveal } from "./Reveal";

const FEATURES = [
  { icon: Truck, title: "Pengiriman Cepat", desc: "Diantar dalam 24 jam ke seluruh kota" },
  { icon: Leaf, title: "100% Organik", desc: "Bebas pestisida, tersertifikasi alami" },
  { icon: ShieldCheck, title: "Garansi Segar", desc: "Uang kembali jika tidak segar" },
  { icon: Clock, title: "Panen Harian", desc: "Dipetik langsung setiap pagi" },
];

export function PromoBanner() {
  const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="promo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Feature strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 80}>
            <div className="group bg-card border border-border rounded-2xl p-5 hover-lift h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-3 group-hover:bg-grad-leaf transition-colors">
                <f.icon size={22} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA banner */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-grad-hero p-8 sm:p-14">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl animate-float" />
          <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full bg-primary/30 blur-3xl animate-float-slow" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                🎉 Promo Spesial Minggu Ini
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">Diskon hingga <span className="gradient-text-citrus">30%</span></h2>
              <p className="text-white/80 max-w-md">Untuk pembelian buah pilihan. Gratis ongkir untuk pesanan di atas Rp 200.000.</p>
            </div>
            <button onClick={scrollToCatalog} className="group flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform whitespace-nowrap">
              Belanja Promo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
