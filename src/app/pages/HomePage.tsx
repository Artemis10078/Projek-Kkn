import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Sword,
  Target,
  Apple,
  Sprout,
  ArrowRight,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
  Ruler,
  CalendarDays,
} from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { Reveal } from "../components/Reveal";
import { MistCanvas } from "../components/immersive/MistCanvas";
import { Tilt3DCard } from "../components/immersive/Tilt3DCard";
import { useLang } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { waLink } from "../../lib/config";

const WM = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const KERIS_IMG = WM + "Keris%20Naga%20Sonobudoyo.jpg?width=900";
const PANAHAN_IMG = WM + "Kyudo%20or%20the%20way%20of%20archery.jpg?width=900";
const BUAH_IMG = WM + "Fruits%20and%20vegetables%20at%20market.jpg?width=900";
const TUMBUHAN_IMG = WM + "Plant%20nursery%2C%20pot%20rows.jpg?width=900";
const DESA_IMG = WM + "Kampung%20Naga%2C%20Tasikmalaya%202.jpg?width=1200";

const SERVICES = [
  { key: "keris", href: "/keris", icon: Sword, img: KERIS_IMG },
  { key: "panahan", href: "/panahan", icon: Target, img: PANAHAN_IMG },
  { key: "buah", href: "/buah", icon: Apple, img: BUAH_IMG },
  { key: "tumbuhan", href: "/tumbuhan", icon: Sprout, img: TUMBUHAN_IMG },
];

function mediaStyle(img: string) {
  return { backgroundImage: "url('" + img + "')" };
}

export function HomePage() {
  const { t } = useLang();
  const { theme } = useTheme();
  const [par, setPar] = useState({ x: 0, y: 0 });
  const frame = useRef(0);

  // Pointer parallax — disabled on touch / small screens to avoid mobile lag.
  useEffect(() => {
    const coarse =
      window.matchMedia?.("(pointer: coarse)").matches ||
      window.innerWidth < 768;
    if (coarse) return;
    const onMove = (e: MouseEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        setPar({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        });
        frame.current = 0;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const orb1Style = {
    transform: "translate3d(" + par.x * 28 + "px, " + par.y * 28 + "px, 0)",
    background:
      "radial-gradient(circle, rgba(82,183,136,0.5), transparent 70%)",
  };
  const orb2Style = {
    transform: "translate3d(" + par.x * -38 + "px, " + par.y * -38 + "px, 0)",
    background:
      "radial-gradient(circle, rgba(245,187,137,0.4), transparent 70%)",
  };
  const heroShiftStyle = {
    transform: "translate3d(" + par.x * -12 + "px, " + par.y * -12 + "px, 0)",
  };

  const desaStats = [
    {
      icon: Users,
      value: t("home.desaStat1Value"),
      label: t("home.desaStat1Label"),
    },
    {
      icon: Ruler,
      value: t("home.desaStat2Value"),
      label: t("home.desaStat2Label"),
    },
    {
      icon: CalendarDays,
      value: t("home.desaStat3Value"),
      label: t("home.desaStat3Label"),
    },
  ];

  return (
    <ShopShell navOverDark>
      {() => (
        <main className="imm-root relative overflow-hidden">
          {/* ===== HERO ===== */}
          <section className="relative min-h-[88vh] flex items-center overflow-hidden">
            <MistCanvas
              theme={theme}
              className="absolute inset-0 w-full h-full"
            />
            <div className="imm-vignette absolute inset-0 pointer-events-none" />
            <div
              className="imm-orb absolute -top-24 -left-10 w-[26rem] h-[26rem]"
              style={orb1Style}
            />
            <div
              className="imm-orb absolute bottom-[-8rem] right-[-4rem] w-[30rem] h-[30rem]"
              style={orb2Style}
            />

            <div
              className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
              style={heroShiftStyle}
            >
              <Reveal>
                <span className="imm-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold imm-brass-text">
                  <Sparkles size={13} /> {t("home.featuredEyebrow")}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="imm-display imm-heading text-4xl sm:text-6xl font-semibold mt-6 leading-tight">
                  {t("home.heroLine1")}{" "}
                  <span className="imm-brass-text">{t("home.heroLine2")}</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="imm-muted max-w-2xl mx-auto mt-5 text-base sm:text-lg leading-relaxed">
                  {t("home.heroSub")}
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <Link
                    to="/buah"
                    className="imm-brass-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
                  >
                    {t("home.ctaStart")} <ArrowRight size={16} />
                  </Link>
                  <a
                    href="#services"
                    className="imm-ghost-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
                  >
                    {t("home.ctaLearn")}
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ===== SERVICES (semua lini usaha) ===== */}
          <section
            id="services"
            className="imm-aurora imm-grain relative py-20 sm:py-28"
          >
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal className="text-center mb-14">
                <p className="imm-brass-text text-sm font-semibold uppercase tracking-[0.22em] mb-2">
                  {t("home.servEyebrow")}
                </p>
                <h2 className="imm-display imm-heading text-3xl sm:text-4xl font-semibold">
                  {t("home.servTitle")}
                </h2>
                <p className="imm-muted max-w-2xl mx-auto mt-3">
                  {t("home.servSub")}
                </p>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SERVICES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Reveal key={s.key} delay={i * 90}>
                      <Tilt3DCard className="h-full">
                        <Link
                          to={s.href}
                          className="imm-glass imm-glass-hover imm-sheen group flex flex-col h-full rounded-3xl overflow-hidden"
                        >
                          <div
                            className="imm-media h-36 w-full relative"
                            style={mediaStyle(s.img)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="imm-pill absolute bottom-3 left-3 w-11 h-11 rounded-xl flex items-center justify-center">
                              <Icon size={20} className="imm-brass-text" />
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <p className="imm-brass-text text-[11px] uppercase tracking-wider font-semibold mb-1">
                              {t("biz." + s.key + ".group")}
                            </p>
                            <h3 className="imm-display imm-heading text-xl mb-2">
                              {t("biz." + s.key + ".title")}
                            </h3>
                            <p className="imm-muted text-sm flex-1 leading-relaxed">
                              {t("biz." + s.key + ".desc")}
                            </p>
                            <span className="imm-brass-text inline-flex items-center gap-1.5 text-sm font-semibold mt-4 group-hover:gap-2.5 transition-all">
                              {t("home.more")} <ArrowRight size={15} />
                            </span>
                          </div>
                        </Link>
                      </Tilt3DCard>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===== PROFIL DESA (referensi gambar 3) ===== */}
          <section className="imm-root relative py-20 sm:py-28">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                {/* Teks naratif */}
                <Reveal>
                  <p className="imm-brass-text text-sm font-semibold uppercase tracking-[0.22em] mb-2">
                    {t("home.desaEyebrow")}
                  </p>
                  <h2 className="imm-display imm-heading text-3xl sm:text-4xl font-semibold mb-5">
                    {t("home.desaTitle")}
                  </h2>
                  <p className="imm-muted leading-relaxed mb-4">
                    {t("home.desaBody1")}
                  </p>
                  <p className="imm-muted leading-relaxed mb-7">
                    {t("home.desaBody2")}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {desaStats.map((st) => {
                      const Icon = st.icon;
                      return (
                        <div
                          key={st.label}
                          className="imm-glass rounded-2xl p-4 text-center"
                        >
                          <Icon
                            size={18}
                            className="imm-brass-text mx-auto mb-2"
                          />
                          <p className="imm-display imm-heading text-2xl font-semibold leading-none">
                            {st.value}
                          </p>
                          <p className="imm-muted text-xs mt-1">{st.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={waLink(t("home.desaWaMsg"))}
                      target="_blank"
                      rel="noreferrer"
                      className="imm-brass-btn inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold"
                    >
                      <MessageCircle size={16} /> {t("home.desaCta")}
                    </a>
                    <span className="imm-muted inline-flex items-center gap-1.5 text-sm">
                      <MapPin size={15} className="imm-brass-text" />{" "}
                      {t("home.desaLocation")}
                    </span>
                  </div>
                </Reveal>

                {/* Foto desa */}
                <Reveal delay={120}>
                  <Tilt3DCard max={5}>
                    <div className="imm-glass imm-sheen rounded-[2rem] p-2.5">
                      <div
                        className="imm-media rounded-[1.6rem] h-72 sm:h-96 w-full relative overflow-hidden"
                        style={mediaStyle(DESA_IMG)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="imm-pill absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white">
                          {t("home.desaCaption")}
                        </div>
                      </div>
                    </div>
                  </Tilt3DCard>
                </Reveal>
              </div>
            </div>
          </section>
        </main>
      )}
    </ShopShell>
  );
}
