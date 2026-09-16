import { useEffect, useState } from "react";
import {
  Target,
  Check,
  MessageCircle,
  Clock,
  Users,
  Crosshair,
  Apple,
} from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { Reveal } from "../components/Reveal";
import { Tilt3DCard } from "../components/immersive/LazyImmersive";
import { fetchArcheryPackages, type ArcheryPackageRow } from "../../lib/db";
import { formatRupiah } from "../../lib/products";
import { waLink } from "../../lib/config";
import { useLang } from "../context/LanguageContext";

const PANAHAN_IMG =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Kyudo%20or%20the%20way%20of%20archery.jpg?width=1600";

// Data cadangan agar paket tetap tampil sebelum SQL upgrade dijalankan.
const FALLBACK_PACKAGES: ArcheryPackageRow[] = [
  // ===== KATEGORI: BUAH =====
  {
    id: 1,
    category: "buah",
    name: "Paket Buah Segar",
    tagline: "Buah hasil dari perkebunan yang unik dan juga bisa dinikmati",
    price: 100000,
    duration: "45 menit",
    arrows: "10 Aneka Buah Unik",
    capacity: "1-10 orang",
    includes: [
      "Sepeda bersama",
      "Pendampingan instruktur",
      "Buah unik seperti Black Sappote dan Buah Ajaib",
    ],
    description:
      "Cocok untuk pemula yang ingin mencoba sensasi buah dari perkebunan Candimulyo pertama kali.",
    image: null,
    popular: false,
    active: true,
    sort: 1,
    created_at: "",
  },
  {
    id: 2,
    category: "buah",
    name: "Paket Buah dan Panah",
    tagline: "Paling dicari",
    price: 150000,
    duration: "60 menit",
    arrows: "30 anak panah",
    capacity: "4 orang",
    includes: [
      "Sepeda Bersama",
      "Sewa busur & anak panah",
      "Pendampingan instruktur",
      "Target jarak ganda",
      "Buah unik seperti Black Sappote dan Buah Ajaib",
    ],
    description:
      "Durasi lebih panjang dengan lebih banyak anak panah untuk berlatih lebih serius.",
    image: null,
    popular: true,
    active: true,
    sort: 2,
    created_at: "",
  },

  // ===== KATEGORI: PANAHAN =====
  {
    id: 3,
    category: "panahan",
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
  {
    id: 4,
    category: "panahan",
    name: "Paket 5 Anak Panah",
    tagline: "Coba-coba seru",
    price: 20000,
    duration: "30 menit",
    arrows: "5 anak panah",
    capacity: "1 orang",
    includes: ["Sewa busur & anak panah", "Pendampingan instruktur"],
    description: "Paket hemat untuk mencoba 5 tembakan.",
    image: null,
    popular: false,
    active: true,
    sort: 4,
    created_at: "",
  },
  {
    id: 5,
    category: "panahan",
    name: "Paket 10 Anak Panah",
    tagline: "Lebih puas ngemil",
    price: 50000,
    duration: "60 menit",
    arrows: "10 anak panah",
    capacity: "1-2 orang",
    includes: [
      "Sewa busur & anak panah",
      "Pendampingan instruktur",
      "Snack & Minuman",
    ],
    description: "10 tembakan lengkap dengan snack dan minuman penyegar.",
    image: null,
    popular: false,
    active: true,
    sort: 5,
    created_at: "",
  },
];

function PackageCard({
  p,
  icon,
  context,
  t,
}: {
  p: ArcheryPackageRow;
  icon: typeof Crosshair;
  context: string;
  t: (key: string) => string;
}) {
  const Icon = icon;
  return (
    <Tilt3DCard className="h-full" max={5}>
      <div
        className={`imm-glass imm-glass-hover relative flex flex-col h-full rounded-3xl p-6 ${
          p.popular ? "ring-2 ring-[var(--imm-brass)]" : ""
        }`}
      >
        {p.popular && (
          <span className="imm-brass-btn absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            {t("panahan.popular")}
          </span>
        )}
        <div className="imm-pill w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={22} className="imm-brass-text" />
        </div>
        <h3 className="imm-display imm-heading text-lg sm:text-xl">{p.name}</h3>
        {p.tagline && <p className="imm-muted text-sm mb-3">{p.tagline}</p>}
        <div className="mb-4">
          <span className="imm-display imm-heading text-2xl sm:text-3xl">
            {formatRupiah(p.price)}
          </span>
          <span className="imm-muted text-sm"> {t("panahan.perPerson")}</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs imm-muted mb-4">
          {p.duration && (
            <span className="flex items-center gap-1">
              <Clock size={13} className="imm-brass-text" /> {p.duration}
            </span>
          )}
          {p.capacity && (
            <span className="flex items-center gap-1">
              <Users size={13} className="imm-brass-text" /> {p.capacity}
            </span>
          )}
          {p.arrows && (
            <span className="flex items-center gap-1">
              <Target size={13} className="imm-brass-text" /> {p.arrows}
            </span>
          )}
        </div>

        <ul className="space-y-2 mb-6 flex-1">
          {(p.includes ?? []).map((inc, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm imm-heading"
            >
              <Check size={16} className="imm-brass-text mt-0.5 shrink-0" />{" "}
              {inc}
            </li>
          ))}
        </ul>

        <a
          href={waLink(
            "Halo Candimulyo Park Tour, saya ingin memesan " +
              p.name +
              " (" +
              formatRupiah(p.price) +
              " / orang) untuk " +
              context +
              ".",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold ${
            p.popular ? "imm-brass-btn" : "imm-ghost-btn"
          }`}
        >
          <MessageCircle size={16} /> {t("panahan.order")}
        </a>
      </div>
    </Tilt3DCard>
  );
}

export function WisataPage() {
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

  // Paket tanpa kategori dianggap paket panahan agar data lama tetap tampil.
  const paketPanahan = packages.filter((p) => p.category !== "buah");
  const paketBuah = packages.filter((p) => p.category === "buah");

  const groups = [
    {
      key: "buah",
      items: paketBuah,
      icon: Apple,
      eyebrow: t("wisata.buahEyebrow"),
      title: t("wisata.buahTitle"),
      sub: t("wisata.buahSub"),
      context: "wisata kebun buah",
    },
    {
      key: "panahan",
      items: paketPanahan,
      icon: Crosshair,
      eyebrow: t("panahan.pickEyebrow"),
      title: t("panahan.pickTitle"),
      sub: t("panahan.pickSub"),
      context: "wahana panahan",
    },
  ].filter((g) => g.items.length > 0);

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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">
              {groups.map((g) => (
                <div key={g.key}>
                  <Reveal className="text-center mb-12">
                    <p className="imm-brass-text text-sm font-semibold uppercase tracking-[0.22em] mb-1">
                      {g.eyebrow}
                    </p>
                    <h2 className="imm-display imm-heading text-2xl sm:text-3xl md:text-4xl">
                      {g.title}
                    </h2>
                    <p className="imm-muted mt-2 max-w-xl mx-auto">{g.sub}</p>
                  </Reveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {g.items.map((p) => (
                      <Reveal key={g.key + "-" + p.id}>
                        <PackageCard
                          p={p}
                          icon={g.icon}
                          context={g.context}
                          t={t}
                        />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </ShopShell>
  );
}
