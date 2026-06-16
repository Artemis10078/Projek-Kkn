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
  whatsappNumber: "6281234567890",
  email: "info@martanipark.id",
  address: "Desa Wisata Martani, Sleman, Yogyakarta",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};

// Bangun tautan WhatsApp dengan pesan otomatis.
export function waLink(message: string): string {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}
