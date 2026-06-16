// Konfigurasi global situs Martani Park Tour.
// Ubah nilai di sini untuk menyesuaikan identitas & kontak.

export const SITE = {
  name: "Martani Park Tour",
  short: "Martani Park",
  tagline: "Desa Wisata Budaya & Agro",
  description:
    "Jelajahi pesona Desa Wisata Martani: koleksi keris pusaka, arena panahan tradisional, serta buah dan tumbuhan segar langsung dari kebun.",
  // Nomor WhatsApp untuk pemesanan paket panahan & info wisata.
  // Format internasional TANPA tanda +, contoh: 6281234567890
  whatsappNumber: "6281xxxxxxxx",
  email: "karangmojo@gmail.com",
  address: "Jl. karangmojo, Rogem, Tamanmartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
  instagram: "https://www.instagram.com/karangmojofrutopia/",
  facebook: "https://facebook.com/",
};

// Bangun tautan WhatsApp dengan pesan otomatis.
export function waLink(message: string): string {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}
