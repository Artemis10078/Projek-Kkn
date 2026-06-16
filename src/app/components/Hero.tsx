import { ArrowRight, Star, Sparkles, Truck, Leaf } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const STATS = [
  { value: "50+", label: "Varietas Buah" },
  { value: "4.9★", label: "Rating Pelanggan" },
  { value: "24h", label: "Pengiriman Segar" },
];

export function Hero() {
  const scrollToCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  const scrollToPromo = () => document.getElementById("promo")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="top" className="relative overflow-hidden bg-grad-hero min-h-[88vh] flex items-center -mt-16 pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1683476656066-c48bfc06621e?w=1600&h=900&fit=crop&auto=format"
          alt="Buah segar berwarna-warni di pasar"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06120B]/90 via-[#0E2419]/70 to-transparent" />
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute top-24 right-[12%] w-32 h-32 rounded-full bg-accent/20 blur-2xl animate-float" />
      <div className="absolute bottom-20 right-[28%] w-40 h-40 rounded-full bg-primary/30 blur-3xl animate-float-slow" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass text-white px-4 py-1.5 rounded-full text-sm font-semibold">
            <Sparkles size={14} className="text-accent" />
            Farm Fresh · Diantar Setiap Hari
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05]">
            Buah <span className="gradient-text-citrus">Terbaik</span>
            <br />Alam untuk Anda
          </h1>

          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Buah segar pilihan langsung dari kebun tropis dan petani lokal. Dipetik tangan, diantar segar ke pintu Anda.
          </p>

          <div className="flex flex-wrap gap-3">
            <button onClick={scrollToCatalog} className="group flex items-center gap-2 bg-grad-citrus text-white px-7 py-3.5 rounded-full font-semibold shadow-glow hover:scale-105 active:scale-100 transition-all">
              Belanja Sekarang <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={scrollToPromo} className="flex items-center gap-2 glass text-white border border-white/30 px-7 py-3.5 rounded-full font-medium hover:bg-white/20 transition-all">
              Lihat Promo
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl text-white font-semibold">{s.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right floating cards */}
        <div className="hidden md:flex relative justify-center items-center h-[420px]">
          <div className="absolute w-64 h-64 rounded-full bg-grad-leaf blur-2xl opacity-40 animate-pulse-soft" />
          <div className="relative w-72 h-72 rounded-[2.5rem] overflow-hidden shadow-2xl animate-float rotate-3">
            <ImageWithFallback src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop&auto=format" alt="Buah segar" className="w-full h-full object-cover" />
          </div>

          {/* Floating badge cards */}
          <div className="absolute top-6 -left-2 glass rounded-2xl px-4 py-3 shadow-lg animate-float-slow">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center"><Star size={16} className="text-accent fill-accent" /></div>
              <div>
                <div className="text-white text-sm font-semibold">4.9 Rating</div>
                <div className="text-white/60 text-[11px]">2.500+ ulasan</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 -right-2 glass rounded-2xl px-4 py-3 shadow-lg animate-float">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center"><Truck size={16} className="text-white" /></div>
              <div>
                <div className="text-white text-sm font-semibold">Gratis Ongkir</div>
                <div className="text-white/60 text-[11px]">Min. Rp 200rb</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 -left-6 glass rounded-2xl px-4 py-3 shadow-lg animate-float-slow">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center"><Leaf size={16} className="text-accent" /></div>
              <div>
                <div className="text-white text-sm font-semibold">100% Organik</div>
                <div className="text-white/60 text-[11px]">Tersertifikasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 sm:h-16" fill="var(--background)">
          <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
