// Konfigurasi global situs Candimulyo Park Tour.
// Ubah nilai di sini untuk menyesuaikan identitas & kontak.

export const SITE = {
  name: "Candimulyo Park Tour",
  short: "Candimulyo Park",
  tagline: "Desa Wisata Budaya, Aneka Buah, dan Panahan",
  description:
    "Jelajahi pesona Candimulyo Park Tour: koleksi keris pusaka, arena panahan tradisional, serta buah dan tumbuhan segar langsung dari kebun.",
  // Nomor WhatsApp untuk pemesanan paket panahan & info wisata.
  // WAJIB format internasional TANPA tanda +, spasi, atau tanda hubung.
  whatsappNumber: "6285713610916",
  // Nomor yang ditampilkan ke pengunjung (boleh pakai format rapi).
  phoneDisplay: "+62 857-1361-0916",
  // Nama pengelola yang tampil di halaman Kontak.
  managerName: "Bapak Seto Legowo",
  email: "karangmojo@gmail.com",
  address:
    "Taman Candimulyo Karangmojo RT/RW 04/02, Karang Mojo, Tamanmartani, Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571",
  // Link embed Google Maps untuk peta di halaman Kontak.
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2044.0865343041714!2d110.48274577591056!3d-7.748243911372818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5b082729461b%3A0xb7b4f855d07f0e4d!2sJual%20bibit%20aneka%20buah%20pak%20seto!5e1!3m2!1sid!2sid!4v1789369970915!5m2!1sid!2sid",
  // Link Google Maps yang dibuka saat tombol "Buka di Google Maps" diklik.
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=Jual%20bibit%20aneka%20buah%20pak%20seto%2C%20Taman%20Candimulyo%20Karangmojo%2C%20Tamanmartani%2C%20Kalasan%2C%20Sleman",
  instagram: "https://www.instagram.com/karangmojofrutopia/",
  facebook: "https://facebook.com/",
};

// Bangun tautan WhatsApp dengan pesan otomatis.
export function waLink(message: string): string {
  return "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(message);
}
