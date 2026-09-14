// Sistem dwibahasa: Bahasa Indonesia (id) & International English (en).
// Konten dinamis dari database (nama produk, deskripsi keris, dll.) tetap
// tampil sesuai yang diinput admin; hanya teks antarmuka yang diterjemahkan.

export type Lang = "id" | "en";

export const LANGS: Lang[] = ["id", "en"];

type Dict = Record<string, string>;

const id: Dict = {
  // Navbar
  "nav.home": "Beranda",
  "nav.keris": "Keris",
  "nav.panahan": "Panahan",
  "nav.buah": "Buah",
  "nav.tumbuhan": "Tumbuhan",
  "nav.kontak": "Kontak",
  "nav.searchPlaceholder": "Cari produk...",
  "nav.user": "Pengguna",
  "nav.orders": "Pesanan Saya",
  "nav.wishlist": "Wishlist",
  "nav.profile": "Profil",
  "nav.admin": "Dashboard Admin",
  "nav.signout": "Keluar",
  "aria.theme": "Ganti tema",
  "aria.search": "Cari",
  "aria.cart": "Keranjang",
  "aria.menu": "Menu",
  "aria.lang": "Ganti bahasa",

  // Footer
  "footer.newsTitle": "Kabar Terbaru dari Desa Wisata",
  "footer.newsSub":
    "Berlangganan untuk info wisata, promo buah & tumbuhan, dan agenda budaya.",
  "footer.emailPlaceholder": "Email Anda",
  "footer.thanks": "Terima kasih sudah berlangganan!",
  "footer.colWisata": "Wisata & Budaya",
  "footer.colBelanja": "Belanja",
  "footer.colInfo": "Informasi",
  "footer.linkKeris": "Galeri Keris",
  "footer.linkPanahan": "Arena Panahan",
  "footer.linkBuah": "Buah Segar",
  "footer.linkTumbuhan": "Tumbuhan",
  "footer.linkHome": "Beranda",
  "footer.linkKontak": "Kontak",
  "footer.madeFor": "Dibuat untuk Desa Wisata Martani.",

  // Katalog
  "catalog.sortPopular": "Terpopuler",
  "catalog.sortPriceAsc": "Harga Termurah",
  "catalog.sortPriceDesc": "Harga Tertinggi",
  "catalog.sortRating": "Rating Tertinggi",
  "catalog.live": "Live dari database",
  "catalog.products": "produk",
  "catalog.searchPlaceholder": "Cari nama, asal, atau kategori...",
  "catalog.empty": "Tidak ada produk yang cocok.",

  // Keranjang
  "cart.title": "Keranjang Anda",
  "cart.addMore1": "Tambah",
  "cart.addMore2": "lagi untuk gratis ongkir!",
  "cart.freeShip": "Selamat! Anda dapat gratis ongkir",
  "cart.empty": "Keranjang Anda kosong",
  "cart.total": "Total",
  "cart.checkout": "Checkout Sekarang",

  // Beranda
  "home.ctaExplore": "Jelajahi Wisata",
  "home.ctaShop": "Belanja Sekarang",
  "home.bizEyebrow": "Semua dalam Satu Tempat",
  "home.bizTitle": "Jelajahi Bisnis Kami",
  "home.bizSub":
    "Dari pelestarian budaya hingga hasil kebun segar, semuanya bisa Anda nikmati di Martani Park Tour.",
  "home.more": "Selengkapnya",
  "home.featuredHeading": "Produk Pilihan",
  "home.featuredEyebrow": "Buah & Tumbuhan",
  // Beranda imersif (Martani Park)
  "home.heroLine1": "Jelajahi Harmoni",
  "home.heroLine2": "Alam & Budaya",
  "home.heroSub":
    "Temukan ketenangan jiwa melalui perpaduan eksklusif antara kearifan lokal Jawa yang sakral dan keindahan alam yang asri di Martani Park Tour.",
  "home.ctaStart": "Mulai Perjalanan",
  "home.ctaLearn": "Jelajahi Panahan",
  "home.servEyebrow": "Layanan Eksklusif",
  "home.servTitle": "Warisan yang Terjaga",
  "home.servSub":
    "Dua pengalaman utama kami \u2014 koleksi keris pusaka dan arena panahan tradisional.",
  "home.stat1Value": "6+",
  "home.stat1Label": "Koleksi Keris",
  "home.stat2Value": "3",
  "home.stat2Label": "Paket Panahan",
  "home.stat3Value": "Setiap Hari",
  "home.stat3Label": "Buka untuk Kunjungan",
  "home.ctaBandTitle": "Rencanakan Kunjungan Anda",
  "home.ctaBandSub":
    "Hubungi kami untuk reservasi paket panahan, kunjungan galeri keris, atau informasi wisata lainnya.",
  "home.ctaBandBtn": "Hubungi via WhatsApp",
  "home.ctaBandMsg":
    "Halo, saya ingin bertanya tentang kunjungan ke Martani Park Tour.",

  // Profil Desa (beranda) — angka contoh, mudah diganti
  "home.desaEyebrow": "Profil Desa",
  "home.desaTitle": "Tentang Desa Wisata Martani",
  "home.desaBody1":
    "Desa Wisata Martani memadukan pelestarian budaya Jawa dengan keindahan alam agraris. Di sini, tradisi pusaka keris, wahana panahan tradisional, serta kebun buah dan tumbuhan hidup berdampingan dalam harmoni.",
  "home.desaBody2":
    "Berada di kaki perbukitan yang asri, desa kami mengundang wisatawan untuk merasakan kehangatan masyarakat lokal, belajar kearifan tradisional, dan menikmati hasil bumi segar langsung dari sumbernya.",
  "home.desaStat1Value": "1.240",
  "home.desaStat1Label": "Jiwa Penduduk",
  "home.desaStat2Value": "320 ha",
  "home.desaStat2Label": "Luas Wilayah",
  "home.desaStat3Value": "1820",
  "home.desaStat3Label": "Tahun Berdiri",
  "home.desaCta": "Hubungi via WhatsApp",
  "home.desaWaMsg":
    "Halo Martani Park Tour, saya ingin mengetahui lebih lanjut tentang profil dan kunjungan ke desa wisata.",
  "home.desaLocation": "Sleman, Yogyakarta",
  "home.desaCaption": "Panorama Desa Wisata Martani",

  // Kartu bisnis
  "biz.keris.title": "Galeri Keris",
  "biz.keris.desc":
    "Koleksi keris pusaka berumur panjang, dipamerkan untuk pelestarian budaya.",
  "biz.keris.group": "Wisata & Budaya",
  "biz.panahan.title": "Arena Panahan",
  "biz.panahan.desc":
    "Wahana panahan tradisional dengan paket 1, 2, dan 3 untuk segala usia.",
  "biz.panahan.group": "Wisata & Budaya",
  "biz.buah.title": "Buah Segar",
  "biz.buah.desc":
    "Aneka buah segar hasil kebun, dipanen dan dikirim setiap hari.",
  "biz.buah.group": "Belanja Hasil Kebun",
  "biz.tumbuhan.title": "Tumbuhan",
  "biz.tumbuhan.desc":
    "Tanaman hias, bonsai, dan bibit pilihan untuk mempercantik rumah Anda.",
  "biz.tumbuhan.group": "Belanja Hasil Kebun",

  // Banner halaman
  "buah.eyebrow": "Hasil Kebun",
  "buah.title": "Buah Segar",
  "buah.subtitle":
    "Buah pilihan dari kebun Desa Wisata Martani, dipanen dan dikirim dalam kondisi segar.",
  "buah.catHeading": "Katalog Buah Segar",
  "buah.catEyebrow": "Belanja Buah",
  "tumbuhan.eyebrow": "Nursery Martani",
  "tumbuhan.title": "Tumbuhan",
  "tumbuhan.subtitle":
    "Tanaman hias, bonsai, sukulen, dan bibit pilihan untuk mempercantik rumah dan taman Anda.",
  "tumbuhan.catHeading": "Katalog Tumbuhan",
  "tumbuhan.catEyebrow": "Belanja Tumbuhan",

  // Halaman Keris
  "keris.eyebrow": "Pelestarian Budaya",
  "keris.title": "Galeri Keris Pusaka",
  "keris.subtitle":
    "Koleksi keris berumur panjang milik Desa Wisata Martani, dipamerkan untuk mengenalkan warisan budaya kepada wisatawan.",
  "keris.featured": "Unggulan",
  "keris.dapur": "Dapur",
  "keris.pamor": "Pamor",
  "keris.note":
    "Koleksi ini dipamerkan untuk pelestarian budaya dan tidak untuk dijual.",

  // Halaman Panahan
  "panahan.eyebrow": "Wahana Wisata",
  "panahan.title": "Arena Panahan",
  "panahan.subtitle":
    "Rasakan serunya memanah di arena panahan tradisional kami. Pilih salah satu dari tiga paket dan pesan langsung lewat WhatsApp.",
  "panahan.pickEyebrow": "Pilih Paket",
  "panahan.pickTitle": "Paket Panahan",
  "panahan.pickSub":
    "Semua paket sudah termasuk peralatan dan pendampingan instruktur berpengalaman.",
  "panahan.popular": "Paling Populer",
  "panahan.perPerson": "/ orang",
  "panahan.order": "Pesan via WhatsApp",

  // Kategori
  "cat.All": "Semua",
  "cat.Tropical": "Tropis",
  "cat.Berries": "Beri",
  "cat.Citrus": "Sitrus",
  "cat.Seasonal": "Musiman",
  "cat.Tanaman Hias": "Tanaman Hias",
  "cat.Bonsai": "Bonsai",
  "cat.Sukulen & Kaktus": "Sukulen & Kaktus",
  "cat.Herbal": "Herbal",
};

const en: Dict = {
  // Navbar
  "nav.home": "Home",
  "nav.keris": "Keris",
  "nav.panahan": "Archery",
  "nav.buah": "Fruits",
  "nav.tumbuhan": "Plants",
  "nav.kontak": "Contact",
  "nav.searchPlaceholder": "Search products...",
  "nav.user": "User",
  "nav.orders": "My Orders",
  "nav.wishlist": "Wishlist",
  "nav.profile": "Profile",
  "nav.admin": "Admin Dashboard",
  "nav.signout": "Sign out",
  "aria.theme": "Toggle theme",
  "aria.search": "Search",
  "aria.cart": "Cart",
  "aria.menu": "Menu",
  "aria.lang": "Switch language",

  // Footer
  "footer.newsTitle": "Latest from the Tourism Village",
  "footer.newsSub":
    "Subscribe for travel updates, fruit & plant promos, and cultural events.",
  "footer.emailPlaceholder": "Your email",
  "footer.thanks": "Thanks for subscribing!",
  "footer.colWisata": "Tourism & Culture",
  "footer.colBelanja": "Shop",
  "footer.colInfo": "Information",
  "footer.linkKeris": "Keris Gallery",
  "footer.linkPanahan": "Archery Range",
  "footer.linkBuah": "Fresh Fruits",
  "footer.linkTumbuhan": "Plants",
  "footer.linkHome": "Home",
  "footer.linkKontak": "Contact",
  "footer.madeFor": "Made for Martani Tourism Village.",

  // Catalog
  "catalog.sortPopular": "Most Popular",
  "catalog.sortPriceAsc": "Lowest Price",
  "catalog.sortPriceDesc": "Highest Price",
  "catalog.sortRating": "Top Rated",
  "catalog.live": "Live from database",
  "catalog.products": "products",
  "catalog.searchPlaceholder": "Search by name, origin, or category...",
  "catalog.empty": "No matching products.",

  // Cart
  "cart.title": "Your Cart",
  "cart.addMore1": "Add",
  "cart.addMore2": "more for free shipping!",
  "cart.freeShip": "You unlocked free shipping",
  "cart.empty": "Your cart is empty",
  "cart.total": "Total",
  "cart.checkout": "Checkout Now",

  // Home
  "home.caExplore": "Explore the Village",
  "home.ctaExplore": "Explore the Village",
  "home.ctaShop": "Shop Now",
  "home.bizEyebrow": "All in One Place",
  "home.bizTitle": "Explore Our Offerings",
  "home.bizSub":
    "From cultural heritage to fresh garden produce, enjoy it all at Martani Park Tour.",
  "home.more": "Learn more",
  "home.featuredHeading": "Featured Products",
  "home.featuredEyebrow": "Fruits & Plants",
  // Immersive home (Martani Park)
  "home.heroLine1": "Explore the Harmony",
  "home.heroLine2": "of Nature & Culture",
  "home.heroSub":
    "Find peace of mind through an exclusive blend of sacred Javanese wisdom and the serene natural beauty of Martani Park Tour.",
  "home.ctaStart": "Start the Journey",
  "home.ctaLearn": "Explore Archery",
  "home.servEyebrow": "Exclusive Experiences",
  "home.servTitle": "Heritage, Preserved",
  "home.servSub":
    "Our two signature experiences \u2014 a collection of heirloom keris and a traditional archery range.",
  "home.stat1Value": "6+",
  "home.stat1Label": "Keris Collection",
  "home.stat2Value": "3",
  "home.stat2Label": "Archery Packages",
  "home.stat3Value": "Daily",
  "home.stat3Label": "Open for Visits",
  "home.ctaBandTitle": "Plan Your Visit",
  "home.ctaBandSub":
    "Reach out to reserve an archery package, tour the keris gallery, or ask about anything else.",
  "home.ctaBandBtn": "Chat on WhatsApp",
  "home.ctaBandMsg":
    "Hello, I would like to ask about visiting Martani Park Tour.",

  // Village profile (home) — example figures, easy to edit
  "home.desaEyebrow": "Village Profile",
  "home.desaTitle": "About Martani Tourism Village",
  "home.desaBody1":
    "Martani Tourism Village blends the preservation of Javanese culture with the beauty of its agrarian landscape. Here, the heritage of the keris, a traditional archery range, and gardens of fruit and plants live side by side in harmony.",
  "home.desaBody2":
    "Nestled at the foot of lush hills, our village invites travellers to feel the warmth of the local community, learn traditional wisdom, and enjoy fresh produce straight from the source.",
  "home.desaStat1Value": "1,240",
  "home.desaStat1Label": "Residents",
  "home.desaStat2Value": "320 ha",
  "home.desaStat2Label": "Total Area",
  "home.desaStat3Value": "1820",
  "home.desaStat3Label": "Established",
  "home.desaCta": "Chat on WhatsApp",
  "home.desaWaMsg":
    "Hello Martani Park Tour, I would like to learn more about the village profile and visiting.",
  "home.desaLocation": "Sleman, Yogyakarta",
  "home.desaCaption": "Martani Tourism Village panorama",

  // Business cards
  "biz.keris.title": "Keris Gallery",
  "biz.keris.desc":
    "A collection of long-preserved heirloom keris, displayed for cultural preservation.",
  "biz.keris.group": "Tourism & Culture",
  "biz.panahan.title": "Archery Range",
  "biz.panahan.desc":
    "A traditional archery range with packages 1, 2, and 3 for all ages.",
  "biz.panahan.group": "Tourism & Culture",
  "biz.buah.title": "Fresh Fruits",
  "biz.buah.desc":
    "A variety of fresh garden fruits, harvested and delivered daily.",
  "biz.buah.group": "Garden Shop",
  "biz.tumbuhan.title": "Plants",
  "biz.tumbuhan.desc":
    "Ornamental plants, bonsai, and choice seedlings to beautify your home.",
  "biz.tumbuhan.group": "Garden Shop",

  // Page banners
  "buah.eyebrow": "Garden Produce",
  "buah.title": "Fresh Fruits",
  "buah.subtitle":
    "Choice fruits from the Martani Tourism Village gardens, harvested and delivered fresh.",
  "buah.catHeading": "Fresh Fruit Catalogue",
  "buah.catEyebrow": "Shop Fruits",
  "tumbuhan.eyebrow": "Martani Nursery",
  "tumbuhan.title": "Plants",
  "tumbuhan.subtitle":
    "Ornamental plants, bonsai, succulents, and choice seedlings to beautify your home and garden.",
  "tumbuhan.catHeading": "Plant Catalogue",
  "tumbuhan.catEyebrow": "Shop Plants",

  // Keris page
  "keris.eyebrow": "Cultural Preservation",
  "keris.title": "Heirloom Keris Gallery",
  "keris.subtitle":
    "A collection of long-preserved keris owned by Martani Tourism Village, displayed to introduce its cultural heritage to visitors.",
  "keris.featured": "Featured",
  "keris.dapur": "Dapur",
  "keris.pamor": "Pamor",
  "keris.note":
    "This collection is displayed for cultural preservation and is not for sale.",

  // Archery page
  "panahan.eyebrow": "Tourism Attraction",
  "panahan.title": "Archery Range",
  "panahan.subtitle":
    "Feel the thrill of archery at our traditional range. Choose one of three packages and order directly via WhatsApp.",
  "panahan.pickEyebrow": "Choose a Package",
  "panahan.pickTitle": "Archery Packages",
  "panahan.pickSub":
    "All packages include equipment and guidance from experienced instructors.",
  "panahan.popular": "Most Popular",
  "panahan.perPerson": "/ person",
  "panahan.order": "Order via WhatsApp",

  // Categories
  "cat.All": "All",
  "cat.Tropical": "Tropical",
  "cat.Berries": "Berries",
  "cat.Citrus": "Citrus",
  "cat.Seasonal": "Seasonal",
  "cat.Tanaman Hias": "Ornamental Plants",
  "cat.Bonsai": "Bonsai",
  "cat.Sukulen & Kaktus": "Succulents & Cacti",
  "cat.Herbal": "Herbs",
};

const TABLES: Record<Lang, Dict> = { id, en };

export function translate(lang: Lang, key: string): string {
  const table = TABLES[lang] ?? id;
  return table[key] ?? id[key] ?? key;
}

// Label kategori produk; jika tidak ada di kamus, kembalikan nilai aslinya.
export function categoryLabel(lang: Lang, value: string): string {
  const key = "cat." + value;
  const table = TABLES[lang] ?? id;
  return table[key] ?? id[key] ?? value;
}
