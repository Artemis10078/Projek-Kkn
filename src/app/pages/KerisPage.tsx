import { useEffect, useState } from "react";
import { Sword, X, MapPin, Sparkles, Layers } from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { Reveal } from "../components/Reveal";
import { Tilt3DCard } from "../components/immersive/Tilt3DCard";
import { fetchKeris, type KerisRow } from "../../lib/db";
import { useLang } from "../context/LanguageContext";

const WM = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const KERIS_BANNER = WM + "Keris%20Naga%20Sonobudoyo.jpg?width=1600";

// Data cadangan agar galeri tetap tampil sebelum SQL upgrade dijalankan.
const FALLBACK_KERIS: KerisRow[] = [
  {
    id: 1,
    name: "Keris Naga Sasra",
    era: "Abad ke-14",
    origin: "Majapahit",
    dapur: "Naga Sasra",
    pamor: "Wos Wutah",
    description:
      "Keris luk tiga belas dengan ukiran naga sepanjang bilah, melambangkan kewibawaan dan kebijaksanaan pemiliknya.",
    image: WM + "Keris%20Naga%20Sonobudoyo.jpg?width=700",
    gallery: null,
    featured: true,
    sort: 1,
    created_at: "",
  },
  {
    id: 2,
    name: "Keris Semar Mesem",
    era: "Abad ke-16",
    origin: "Mataram",
    dapur: "Semar",
    pamor: "Udan Mas",
    description:
      "Dipercaya membawa wibawa dan daya pikat. Salah satu koleksi pusaka favorit di desa wisata.",
    image: WM + "Keris%20Semar%20Mesem.jpg?width=700",
    gallery: null,
    featured: false,
    sort: 2,
    created_at: "",
  },
  {
    id: 3,
    name: "Keris Alang",
    era: "Abad ke-17",
    origin: "Sumatra",
    dapur: "Alang",
    pamor: "Beras Wutah",
    description:
      "Keris berbilah lurus khas Melayu dengan garapan rapi, mencerminkan kehalusan seni tempa pusaka.",
    image: WM + "Keris%20Alang.jpg?width=700",
    gallery: null,
    featured: false,
    sort: 3,
    created_at: "",
  },
  {
    id: 4,
    name: "Keris Cundrik",
    era: "Abad ke-15",
    origin: "Jawa",
    dapur: "Cundrik",
    pamor: "Ngulit Semangka",
    description:
      "Keris berukuran kecil yang dahulu kerap dibawa sebagai senjata pelindung pribadi.",
    image: WM + "Keris%20Cundrik.jpg?width=700",
    gallery: null,
    featured: false,
    sort: 4,
    created_at: "",
  },
  {
    id: 5,
    name: "Keris Bali",
    era: "Abad ke-18",
    origin: "Bali",
    dapur: "Tilam Upih",
    pamor: "Wos Wutah",
    description:
      "Keris dengan hulu berukir khas Bali yang menonjolkan kekayaan seni ukir Nusantara.",
    image: WM + "Kris%20bali.jpg?width=700",
    gallery: null,
    featured: false,
    sort: 5,
    created_at: "",
  },
  {
    id: 6,
    name: "Keris Sumatra",
    era: "Abad ke-19",
    origin: "Sumatra",
    dapur: "Sepukal",
    pamor: "Lurus",
    description:
      "Koleksi keris Sumatra dengan bentuk gagah, kini tersimpan sebagai bagian dari warisan budaya.",
    image: WM + "Sumatra%20Keris-Dolch%20Museum%20Rietberg.jpg?width=700",
    gallery: null,
    featured: false,
    sort: 6,
    created_at: "",
  },
];

export function KerisPage() {
  const [items, setItems] = useState<KerisRow[]>(FALLBACK_KERIS);
  const [active, setActive] = useState<KerisRow | null>(null);
  const { t } = useLang();

  useEffect(() => {
    let mounted = true;
    fetchKeris().then((rows) => {
      if (mounted && rows.length > 0) setItems(rows);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ShopShell navOverDark="photo">
      {() => (
        <main className="imm-root">
          <PageBanner
            icon={Sword}
            eyebrow={t("keris.eyebrow")}
            title={t("keris.title")}
            subtitle={t("keris.subtitle")}
            image={KERIS_BANNER}
          />

          <section className="imm-aurora imm-grain relative">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((k) => (
                  <Reveal key={k.id}>
                    <Tilt3DCard className="h-full" max={6}>
                      <button
                        onClick={() => setActive(k)}
                        className="imm-glass imm-glass-hover imm-sheen group text-left w-full rounded-3xl overflow-hidden h-full"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          {k.image ? (
                            <img
                              src={k.image}
                              alt={k.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5a3d23] to-[#3b2a1a]">
                              <Sword size={40} className="text-white/80" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="imm-display imm-heading text-xl">
                              {k.name}
                            </h3>
                            {k.featured && (
                              <span className="imm-brass-btn text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                {t("keris.featured")}
                              </span>
                            )}
                          </div>
                          <p className="imm-muted text-sm flex items-center gap-1.5">
                            <MapPin size={13} className="imm-brass-text" />{" "}
                            {k.origin ?? "-"} · {k.era ?? "-"}
                          </p>
                        </div>
                      </button>
                    </Tilt3DCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Lightbox */}
          {active && (
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setActive(null)}
            >
              <div
                className="imm-glass rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="aspect-[16/10]">
                    {active.image ? (
                      <img
                        src={active.image}
                        alt={active.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5a3d23] to-[#3b2a1a]">
                        <Sword size={60} className="text-white/80" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="imm-display imm-heading text-2xl mb-1">
                    {active.name}
                  </h2>
                  <p className="imm-muted text-sm mb-4 flex items-center gap-1.5">
                    <MapPin size={14} className="imm-brass-text" />{" "}
                    {active.origin ?? "-"} · {active.era ?? "-"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="imm-pill rounded-xl p-3">
                      <p className="text-[11px] uppercase tracking-wider imm-muted flex items-center gap-1 mb-0.5">
                        <Layers size={12} /> {t("keris.dapur")}
                      </p>
                      <p className="text-sm imm-heading font-medium">
                        {active.dapur ?? "-"}
                      </p>
                    </div>
                    <div className="imm-pill rounded-xl p-3">
                      <p className="text-[11px] uppercase tracking-wider imm-muted flex items-center gap-1 mb-0.5">
                        <Sparkles size={12} /> {t("keris.pamor")}
                      </p>
                      <p className="text-sm imm-heading font-medium">
                        {active.pamor ?? "-"}
                      </p>
                    </div>
                  </div>
                  {active.description && (
                    <p className="imm-muted text-sm leading-relaxed">
                      {active.description}
                    </p>
                  )}
                  <p className="mt-4 text-xs imm-muted italic">
                    {t("keris.note")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </ShopShell>
  );
}
