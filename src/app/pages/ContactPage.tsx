import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { SITE, waLink } from "../../lib/config";

// Daftar keperluan yang bisa dipilih pengunjung, lengkap dengan
// informasi yang perlu disiapkan sebelum menghubungi pengelola.
const KEPERLUAN = [
  {
    title: "Reservasi Panahan",
    desc: "Pemesanan paket panahan di arena tradisional, termasuk kunjungan rombongan.",
    prepare: [
      "Tanggal & jam kunjungan",
      "Jumlah peserta & paket yang dipilih",
      "Nama pemesan & nomor yang bisa dihubungi",
    ],
    message:
      "Halo " +
      SITE.name +
      ", saya ingin reservasi paket panahan. Tanggal: ..., jumlah peserta: ..., paket: ...",
  },
  {
    title: "Kunjungan Galeri Keris",
    desc: "Wisata budaya, edukasi sekolah, atau pendampingan pemandu di galeri keris pusaka.",
    prepare: [
      "Tanggal & jam rencana kunjungan",
      "Jumlah pengunjung / asal instansi",
      "Kebutuhan pemandu atau sesi edukasi",
    ],
    message:
      "Halo " +
      SITE.name +
      ", saya ingin mengatur kunjungan ke galeri keris. Tanggal: ..., jumlah pengunjung: ...",
  },
  {
    title: "Pesanan Buah & Tumbuhan",
    desc: "Pemesanan buah segar, tanaman hias, bonsai, dan bibit, termasuk pengiriman ke luar desa.",
    prepare: [
      "Nama produk & jumlah pesanan",
      "Alamat pengiriman atau rencana ambil di lokasi",
      "Metode pembayaran yang diinginkan",
    ],
    message:
      "Halo " +
      SITE.name +
      ", saya ingin memesan buah/tumbuhan. Produk: ..., jumlah: ..., alamat kirim: ...",
  },
  {
    title: "Kerja Sama & Media",
    desc: "Ajuan kerja sama UMKM, program kampus/KKN, liputan media, dan kegiatan desa lainnya.",
    prepare: [
      "Nama lembaga / instansi",
      "Bentuk kerja sama yang diajukan",
      "Rentang waktu pelaksanaan",
    ],
    message:
      "Halo " +
      SITE.name +
      ", saya ingin mengajukan kerja sama. Instansi: ..., bentuk kerja sama: ...",
  },
];

export default function ContactPage() {
  return (
    <ShopShell>
      {() => (
        <main className="imm-root">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {/* Judul halaman */}
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                Pusat Informasi
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                Kontak Kami
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hubungi kami untuk reservasi kunjungan, paket panahan, atau pemesanan
                buah &amp; tumbuhan.
              </p>
            </div>

            {/* Kartu utama: info kontak + peta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-soft">
              {/* Kiri: informasi kontak */}
              <div className="flex flex-col justify-center space-y-7">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                    Informasi Pengelola
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Jangan ragu untuk menghubungi kami melalui WhatsApp atau telepon
                    langsung.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-grad-leaf flex items-center justify-center">
                      <Phone size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {SITE.managerName}
                      </p>
                      <p className="text-lg font-medium text-foreground">
                        {SITE.phoneDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-grad-leaf flex items-center justify-center">
                      <Mail size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-md font-medium text-foreground break-all">
                        {SITE.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-grad-leaf flex items-center justify-center">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat Lokasi</p>
                      <p className="text-md font-medium text-foreground">{SITE.name}</p>
                      <p className="text-sm text-muted-foreground break-words">
                        {SITE.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-grad-leaf flex items-center justify-center">
                      <Clock size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Jam Operasional</p>
                      <p className="text-md font-medium text-foreground">
                        Senin–Minggu, 08.00–17.00 WIB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href={waLink(
                      "Halo " +
                        SITE.name +
                        ", saya ingin bertanya tentang kunjungan dan produk desa wisata.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-grad-leaf text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:scale-105 transition-transform"
                  >
                    <MessageCircle size={15} /> Chat WhatsApp
                  </a>
                  <a
                    href={"tel:+" + SITE.whatsappNumber}
                    className="inline-flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
                  >
                    <Phone size={15} /> Telepon
                  </a>
                  <a
                    href={SITE.mapLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
                  >
                    <MapPin size={15} /> Buka di Google Maps
                  </a>
                </div>
              </div>

              {/* Kanan: peta lokasi */}
              <div className="w-full h-64 sm:h-80 md:h-full md:min-h-[360px] rounded-2xl overflow-hidden border border-border shadow-lg">
                <iframe
                  src={SITE.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={"Lokasi " + SITE.name}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Pilihan keperluan */}
            <div className="mt-16">
              <div className="text-center mb-10">
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  Keperluan Anda
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                  Apa yang bisa kami bantu?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Agar balasan kami cepat dan tepat, pilih salah satu keperluan berikut
                  dan siapkan informasi yang dibutuhkan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {KEPERLUAN.map((item) => (
                  <div
                    key={item.title}
                    className="bg-card border border-border rounded-2xl p-6 shadow-soft flex flex-col"
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                    <p className="text-xs uppercase tracking-wider text-primary mb-2">
                      Siapkan informasi ini
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                      {item.prepare.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                    <a
                      href={waLink(item.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 bg-grad-leaf text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:scale-105 transition-transform"
                    >
                      <MessageCircle size={15} /> Hubungi via WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </ShopShell>
  );
}
