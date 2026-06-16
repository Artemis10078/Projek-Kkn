import { useEffect, useState } from "react";
import {
  Target,
  Check,
  MessageCircle,
  Clock,
  Users,
  Crosshair,
} from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { Reveal } from "../components/Reveal";
import { Tilt3DCard } from "../components/immersive/Tilt3DCard";
import { fetchArcheryPackages, type ArcheryPackageRow } from "../../lib/db";
import { formatRupiah } from "../../lib/products";
import { waLink } from "../../lib/config";
import { useLang } from "../context/LanguageContext";

const PANAHAN_IMG =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Kyudo%20or%20the%20way%20of%20archery.jpg?width=1600";

// Data cadangan agar paket tetap tampil sebelum SQL upgrade dijalankan.
const FALLBACK_PACKAGES: ArcheryPackageRow[] = [
  {
    id: 1,
    name: "Paket 1 - Pemula",
    tagline: "Coba pertama panahan",
    price: 25000,
    duration: "30 menit",
    arrows: "15 anak panah",
    capacity: "1 orang",
    includes: [
      "Sewa busur & anak panah",
      "Pendampingan instruktur",
      "Target standar",
    ],
    description:
      "Cocok untuk pemula yang ingin mencoba sensasi memanah pertama kali.",
    image: null,
    popular: false,
    active: true,
    sort: 1,
    created_at: "",
  },
  {
    id: 2,
    name: "Paket 2 - Reguler",
    tagline: "Paling populer",
    price: 50000,
    duration: "60 menit",
    arrows: "40 anak panah",
    capacity: "1 orang",
    includes: [
      "Sewa busur & anak panah",
      "Pendampingan instruktur",
      "Target jarak ganda",
      "Air mineral",
    ],
    description:
      "Durasi lebih panjang dengan lebih banyak anak panah untuk berlatih lebih serius.",
    image: null,
    popular: true,
    active: true,
    sort: 2,
    created_at: "",
  },
  {
    id: 3,
    name: "Paket 3 - Rombongan",
    tagline: "Seru bareng keluarga",
    price: 100000,
    duration: "90 menit",
    arrows: "Anak panah tanpa batas",
    capacity: "3 - 5 orang",
    includes: [
      "Sewa busur & anak panah",
      "Pendampingan instruktur",
      "Target jarak ganda",
      "Air mineral & snack",
      "Dokumentasi foto",
    ],
    description:
      "Paket hemat untuk keluarga atau rombongan yang ingin bermain bersama.",
    image: null,
    popular: false,
    active: true,
    sort: 3,
    created_at: "",
  },
];

export function PanahanPage() {
  const [packages, setPackages] =
    useState<ArcheryPackageRow[]>(FALLBACK_PACKAGES);
  const { t } = useLang();

  useEffect(() => {
    let mounted = true;
    fetchArcheryPackages().then((rows) => {
      if (mounted && rows.length > 0) setPackages(rows);
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
            icon={Target}
            eyebrow={t("panahan.eyebrow")}
            title={t("panahan.title")}
            subtitle={t("panahan.subtitle")}
            image={PANAHAN_IMG}
          />

          <section className="imm-aurora imm-grain relative">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <Reveal className="text-center mb-12">
                <p className="imm-brass-text text-sm font-semibold uppercase tracking-[0.22em] mb-1">
                  {t("panahan.pickEyebrow")}
                </p>
                <h2 className="imm-display imm-heading text-3xl sm:text-4xl">
                  {t("panahan.pickTitle")}
                </h2>
                <p className="imm-muted mt-2 max-w-xl mx-auto">
                  {t("panahan.pickSub")}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {packages.map((p) => (
                  <Reveal key={p.id}>
                    <Tilt3DCard className="h-full" max={5}>
                      <div
                        className={`imm-glass imm-glass-hover relative flex flex-col h-full rounded-3xl p-6 ${
                          p.popular ? "ring-2 ring-[var(--imm-brass)]" : ""
                        }`}
                      >
                        {p.popular && (
                          <span className="imm-brass-btn absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full">
                            {t("panahan.popular")}
                          </span>
                        )}
                        <div className="imm-pill w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                          <Crosshair size={22} className="imm-brass-text" />
                        </div>
                        <h3 className="imm-display imm-heading text-xl">
                          {p.name}
                        </h3>
                        {p.tagline && (
                          <p className="imm-muted text-sm mb-3">{p.tagline}</p>
                        )}
                        <div className="mb-4">
                          <span className="imm-display imm-heading text-3xl">
                            {formatRupiah(p.price)}
                          </span>
                          <span className="imm-muted text-sm">
                            {" "}
                            {t("panahan.perPerson")}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs imm-muted mb-4">
                          {p.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={13} className="imm-brass-text" />{" "}
                              {p.duration}
                            </span>
                          )}
                          {p.capacity && (
                            <span className="flex items-center gap-1">
                              <Users size={13} className="imm-brass-text" />{" "}
                              {p.capacity}
                            </span>
                          )}
                          {p.arrows && (
                            <span className="flex items-center gap-1">
                              <Target size={13} className="imm-brass-text" />{" "}
                              {p.arrows}
                            </span>
                          )}
                        </div>

                        <ul className="space-y-2 mb-6 flex-1">
                          {(p.includes ?? []).map((inc, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm imm-heading"
                            >
                              <Check
                                size={16}
                                className="imm-brass-text mt-0.5 shrink-0"
                              />{" "}
                              {inc}
                            </li>
                          ))}
                        </ul>

                        <a
                          href={waLink(
                            "Halo Martani Park Tour, saya ingin memesan " +
                              p.name +
                              " (" +
                              formatRupiah(p.price) +
                              " / orang) untuk wahana panahan.",
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold ${
                            p.popular ? "imm-brass-btn" : "imm-ghost-btn"
                          }`}
                        >
                          <MessageCircle size={16} /> {t("panahan.order")}
                        </a>
                      </div>
                    </Tilt3DCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </ShopShell>
  );
}
