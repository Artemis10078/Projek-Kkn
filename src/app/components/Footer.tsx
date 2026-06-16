import { useState } from "react";
import { Link } from "react-router";
import { Leaf, Instagram, Facebook, Mail, Send, MapPin, Phone } from "lucide-react";
import { SITE } from "../../lib/config";
import { useLang } from "../context/LanguageContext";

const LINKS: { titleKey: string; items: { labelKey: string; to: string }[] }[] = [
  {
    titleKey: "footer.colWisata",
    items: [
      { labelKey: "footer.linkKeris", to: "/keris" },
      { labelKey: "footer.linkPanahan", to: "/panahan" },
    ],
  },
  {
    titleKey: "footer.colBelanja",
    items: [
      { labelKey: "footer.linkBuah", to: "/buah" },
      { labelKey: "footer.linkTumbuhan", to: "/tumbuhan" },
    ],
  },
  {
    titleKey: "footer.colInfo",
    items: [
      { labelKey: "footer.linkHome", to: "/" },
      { labelKey: "footer.linkKontak", to: "/#footer" },
    ],
  },
];

export function Footer() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer id="footer" className="bg-card border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter */}
        <div className="bg-grad-leaf rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 shadow-soft">
          <div className="text-center lg:text-left">
            <h3 className="font-display text-2xl text-white mb-1">{t("footer.newsTitle")}</h3>
            <p className="text-white/80 text-sm">{t("footer.newsSub")}</p>
          </div>
          <form onSubmit={subscribe} className="flex items-center gap-2 w-full max-w-md">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 flex-1">
              <Mail size={16} className="text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.emailPlaceholder")}
                className="bg-transparent outline-none text-sm w-full text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="bg-accent text-accent-foreground p-3 rounded-full hover:scale-110 transition-transform shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {sent && (
          <p className="text-center text-primary text-sm -mt-8 mb-8">{t("footer.thanks")}</p>
        )}

        {/* Main */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-grad-leaf flex items-center justify-center shadow-md">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-semibold gradient-text">{SITE.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">{SITE.description}</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> {SITE.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-primary" /> +{SITE.whatsappNumber}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-primary" /> {SITE.email}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
              >
                <Instagram size={16} />
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.titleKey}>
              <h4 className="font-semibold text-foreground mb-3 text-sm">{t(col.titleKey)}</h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.labelKey}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. {t("footer.madeFor")}
        </div>
      </div>
    </footer>
  );
}
