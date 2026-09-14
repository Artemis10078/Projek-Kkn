// Konfigurasi global situs Candi Mulyo Park Tour.
// Ubah nilai di sini untuk menyesuaikan identitas & kontak.

export const SITE = {
  name: "Candi Mulyo Park Tour",
  short: "Candi Mulyo Park",
  tagline: "Desa Wisata Budaya & Agro",
  description:
    "Jelajahi pesona Desa Wisata Candi Mulyo: koleksi keris pusaka, arena panahan tradisional, serta buah dan tumbuhan segar langsung dari kebun.",
  // Nomor WhatsApp untuk pemesanan paket panahan & info wisata.
  // Format internasional TANPA tanda +, contoh: 6281234567890
  whatsappNumber: "6285713610916",
  email: "info@candimulyopark.id",
  address:
    "Taman Candimulyo Karangmojo RT/RW 04/02, Karang Mojo, Tamanmartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
  // Nama & nomor pengelola yang tampil di halaman Kontak.
  managerName: "Bapak Seto Legowo",
  phoneDisplay: "+62 857-1361-0916",
  // Kata kunci pencarian Google Maps untuk peta di halaman Kontak.
  mapQuery: "Jual bibit aneka buah pak seto, Taman Candimulyo Karangmojo, Tamanmartani, Kalasan, Sleman",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};

// Bangun tautan WhatsApp dengan pesan otomatis.
export function waLink(message: string): string {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}
