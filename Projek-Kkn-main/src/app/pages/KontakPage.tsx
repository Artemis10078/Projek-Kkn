import { useState } from "react";
import {
  MessageCircle,
  Phone,
  MapPin,
  Target,
  Sword,
  ShoppingBasket,
  Handshake,
  Send,
  Navigation,
  Headphones,
} from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { useLang } from "../context/LanguageContext";
import { SITE, waLink } from "../../lib/config";

const BANNER_IMG =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Kampung%20Naga%2C%20Tasikmalaya%202.jpg?width=1200";

// Empat keperluan utama. Tiap kartu menjelaskan data apa yang perlu
// disiapkan pengunjung, lalu membuka WhatsApp dengan pesan siap kirim.
const TOPICS = [
  {
    key: "panahan",
    icon: Target,
    needKeys: [
      "kontak.topic.panahan.n1",
      "kontak.topic.panahan.n2",
      "kontak.topic.panahan.n3",
    ],
    msgKey: "kontak.topic.panahan.msg",
  },
  {
    key: "keris",
    icon: Sword,
    needKeys: [
      "kontak.topic.keris.n1",
      "kontak.topic.keris.n2",
      "kontak.topic.keris.n3",
    ],
    msgKey: "kontak.topic.keris.msg",
  },
  {
    key: "belanja",
    icon: ShoppingBasket,
    needKeys: [
      "kontak.topic.belanja.n1",
      "kontak.topic.belanja.n2",
      "kontak.topic.belanja.n3",
    ],
    msgKey: "kontak.topic.belanja.msg",
  },
  {
    key: "kerjasama",
    icon: Handshake,
    needKeys: [
      "kontak.topic.kerjasama.n1",
      "kontak.topic.kerjasama.n2",
      "kontak.topic.kerjasama.n3",
    ],
    msgKey: "kontak.topic.kerjasama.msg",
  },
];

export function KontakPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    contact: "",
    topic: "",
    people: "",
    date: "",
    message: "",
  });

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Halo " + SITE.name + ",",
      t("kontak.form.waName") + ": " + (form.name || "-"),
      t("kontak.form.waContact") + ": " + (form.contact || "-"),
      t("kontak.form.waTopic") + ": " + (form.topic || "-"),
      t("kontak.form.waDate") + ": " + (form.date || "-"),
      t("kontak.form.waPeople") + ": " + (form.people || "-"),
      "",
      form.message,
    ];
    window.open(waLink(lines.join("\n")), "_blank");
  };

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(SITE.mapQuery);
  const mapEmbed =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(SITE.mapQuery) +
    "&z=16&output=embed";

  return (
    <ShopShell navOverDark="photo">
      {() => (
        <main className="font-body">
          <PageBanner
            icon={Headphones}
            eyebrow={t("kontak.eyebrow")}
            title={t("kontak.title")}
            subtitle={t("kontak.subtitle")}
            image={BANNER_IMG}
          />

          {/* ===== Informasi pengelola + peta lokasi ===== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="bg-card border border-border rounded-3xl shadow-soft overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Kolom kiri: kontak pengelola */}
                <div className="p-6 sm:p-10">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                    {t("kontak.mgrTitle")}
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {t("kontak.mgrSub")}
                  </p>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-11 h-11 rounded-full bg-grad-leaf flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {SITE.managerName}
                      </p>
                      <p className="font-display text-xl text-foreground font-semibold">
                        {SITE.phoneDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("kontak.addressLabel")}
                      </p>
                      <p className="font-semibold text-foreground">
                        {SITE.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {SITE.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={waLink(t("kontak.ch.waMsg"))}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle size={16} /> {t("kontak.ctaWa")}
                    </a>
                    <a
                      href={"tel:+" + SITE.whatsappNumber}
                      className="inline-flex items-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground px-5 py-3 hover:border-primary/60 transition-colors"
                    >
                      <Phone size={16} className="text-primary" />{" "}
                      {t("kontak.ctaCall")}
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground px-5 py-3 hover:border-primary/60 transition-colors"
                    >
                      <Navigation size={16} className="text-primary" />{" "}
                      {t("kontak.openMaps")}
                    </a>
                  </div>
                </div>

                {/* Kolom kanan: peta */}
                <div className="min-h-[300px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-border">
                  <iframe
                    title={t("kontak.mapTitle")}
                    src={mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[300px] border-0"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ===== Keperluan ===== */}
          <section className="bg-secondary/40 border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
              <div className="max-w-2xl mb-10">
                <p className="text-primary text-sm font-semibold uppercase tracking-[0.18em] mb-2">
                  {t("kontak.needEyebrow")}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                  {t("kontak.needTitle")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("kontak.needSub")}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={topic.key}
                      className="bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-grad-leaf flex items-center justify-center mb-4">
                        <Icon
                          size={20}
                          className="text-white"
                          strokeWidth={1.8}
                        />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {t("kontak.topic." + topic.key + ".title")}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("kontak.topic." + topic.key + ".desc")}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-2">
                        {t("kontak.needList")}
                      </p>
                      <ul className="space-y-1.5 mb-6">
                        {topic.needKeys.map((nk) => (
                          <li
                            key={nk}
                            className="text-sm text-muted-foreground flex gap-2"
                          >
                            <span className="text-primary">&bull;</span>
                            <span>{t(nk)}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={waLink(t(topic.msgKey))}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle size={15} /> {t("kontak.topicCta")}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===== Formulir pesan ===== */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                {t("kontak.formTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("kontak.formSub")}
              </p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("kontak.form.name")}
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                      placeholder={t("kontak.form.namePh")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("kontak.form.contact")}
                    </label>
                    <input
                      required
                      value={form.contact}
                      onChange={set("contact")}
                      className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                      placeholder={t("kontak.form.contactPh")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("kontak.form.topic")}
                  </label>
                  <select
                    required
                    value={form.topic}
                    onChange={set("topic")}
                    className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">{t("kontak.form.topicPh")}</option>
                    {TOPICS.map((tp) => (
                      <option
                        key={tp.key}
                        value={t("kontak.topic." + tp.key + ".title")}
                      >
                        {t("kontak.topic." + tp.key + ".title")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("kontak.form.date")}
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={set("date")}
                      className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("kontak.form.people")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.people}
                      onChange={set("people")}
                      className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                      placeholder={t("kontak.form.peoplePh")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("kontak.form.message")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    className="w-full rounded-xl bg-input-background border border-border px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-y"
                    placeholder={t("kontak.form.messagePh")}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
                >
                  <Send size={16} /> {t("kontak.form.submit")}
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  {t("kontak.form.note")}
                </p>
              </form>
            </div>
          </section>
        </main>
      )}
    </ShopShell>
  );
}
