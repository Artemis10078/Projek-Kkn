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
  "footer.madeFor": "Dibuat untuk Desa Wisata Candi Mulyo.",

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
    "Dari pelestarian budaya hingga hasil kebun segar, semuanya bisa Anda nikmati di Candi Mulyo Park Tour.",
  "home.more": "Selengkapnya",
  "home.featuredHeading": "Produk Pilihan",
  "home.featuredEyebrow": "Buah & Tumbuhan",
  // Beranda imersif (Candi Mulyo Park)
  "home.heroLine1": "Jelajahi Harmoni",
  "home.heroLine2": "Alam & Budaya",
  "home.heroSub":
    "Temukan ketenangan jiwa melalui perpaduan eksklusif antara kearifan lokal Jawa yang sakral dan keindahan alam yang asri di Candi Mulyo Park Tour.",
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
    "Halo, saya ingin bertanya tentang kunjungan ke Candi Mulyo Park Tour.",

  // Profil Desa (beranda) — angka contoh, mudah diganti
  "home.desaEyebrow": "Profil Desa",
  "home.desaTitle": "Tentang Desa Wisata Candi Mulyo",
  "home.desaBody1":
    "Desa Wisata Candi Mulyo memadukan pelestarian budaya Jawa dengan keindahan alam agraris. Di sini, tradisi pusaka keris, wahana panahan tradisional, serta kebun buah dan tumbuhan hidup berdampingan dalam harmoni.",
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
    "Halo Candi Mulyo Park Tour, saya ingin mengetahui lebih lanjut tentang profil dan kunjungan ke desa wisata.",
  "home.desaLocation": "Sleman, Yogyakarta",
  "home.desaCaption": "Panorama Desa Wisata Candi Mulyo",

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
    "Buah pilihan dari kebun Desa Wisata Candi Mulyo, dipanen dan dikirim dalam kondisi segar.",
  "buah.catHeading": "Katalog Buah Segar",
  "buah.catEyebrow": "Belanja Buah",
  "tumbuhan.eyebrow": "Nursery Candi Mulyo",
  "tumbuhan.title": "Tumbuhan",
  "tumbuhan.subtitle":
    "Tanaman hias, bonsai, sukulen, dan bibit pilihan untuk mempercantik rumah dan taman Anda.",
  "tumbuhan.catHeading": "Katalog Tumbuhan",
  "tumbuhan.catEyebrow": "Belanja Tumbuhan",

  // Halaman Keris
  "keris.eyebrow": "Pelestarian Budaya",
  "keris.title": "Galeri Keris Pusaka",
  "keris.subtitle":
    "Koleksi keris berumur panjang milik Desa Wisata Candi Mulyo, dipamerkan untuk mengenalkan warisan budaya kepada wisatawan.",
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

  // Halaman Kontak
  "kontak.eyebrow": "Pusat Informasi",
  "kontak.title": "Kontak Kami",
  "kontak.subtitle":
    "Hubungi kami untuk reservasi kunjungan, paket panahan, atau pemesanan buah & tumbuhan.",

  "kontak.mgrTitle": "Informasi Pengelola",
  "kontak.mgrSub":
    "Jangan ragu untuk menghubungi kami melalui WhatsApp atau telepon langsung.",
  "kontak.addressLabel": "Alamat Lokasi",
  "kontak.ctaWa": "Chat WhatsApp",
  "kontak.ctaCall": "Telepon",
  "kontak.openMaps": "Buka di Google Maps",
  "kontak.mapTitle": "Peta lokasi Candi Mulyo Park Tour",

  "kontak.needEyebrow": "Keperluan Anda",
  "kontak.needTitle": "Apa yang bisa kami bantu?",
  "kontak.needSub":
    "Agar balasan kami cepat dan tepat, pilih salah satu keperluan berikut dan siapkan informasi yang dibutuhkan.",
  "kontak.needList": "Siapkan informasi ini",
  "kontak.topicCta": "Hubungi via WhatsApp",

  "kontak.topic.panahan.title": "Reservasi Panahan",
  "kontak.topic.panahan.desc":
    "Pemesanan paket panahan di arena tradisional, termasuk kunjungan rombongan.",
  "kontak.topic.panahan.n1": "Tanggal & jam kunjungan",
  "kontak.topic.panahan.n2": "Jumlah peserta & paket yang dipilih",
  "kontak.topic.panahan.n3": "Nama pemesan & nomor yang bisa dihubungi",
  "kontak.topic.panahan.msg":
    "Halo Candi Mulyo Park Tour, saya ingin reservasi paket panahan. Tanggal: ..., jumlah peserta: ..., paket: ...",

  "kontak.topic.keris.title": "Kunjungan Galeri Keris",
  "kontak.topic.keris.desc":
    "Kunjungan wisata budaya, edukasi sekolah, atau pendampingan pemandu di galeri keris pusaka.",
  "kontak.topic.keris.n1": "Tanggal & jam rencana kunjungan",
  "kontak.topic.keris.n2": "Jumlah pengunjung / asal instansi",
  "kontak.topic.keris.n3": "Kebutuhan pemandu atau sesi edukasi",
  "kontak.topic.keris.msg":
    "Halo Candi Mulyo Park Tour, saya ingin mengatur kunjungan ke galeri keris. Tanggal: ..., jumlah pengunjung: ...",

  "kontak.topic.belanja.title": "Pesanan Buah & Tumbuhan",
  "kontak.topic.belanja.desc":
    "Pemesanan buah segar, tanaman hias, bonsai, dan bibit, termasuk pengiriman ke luar desa.",
  "kontak.topic.belanja.n1": "Nama produk & jumlah pesanan",
  "kontak.topic.belanja.n2": "Alamat pengiriman atau rencana ambil di lokasi",
  "kontak.topic.belanja.n3": "Metode pembayaran yang diinginkan",
  "kontak.topic.belanja.msg":
    "Halo Candi Mulyo Park Tour, saya ingin memesan buah/tumbuhan. Produk: ..., jumlah: ..., alamat kirim: ...",

  "kontak.topic.kerjasama.title": "Kerja Sama & Media",
  "kontak.topic.kerjasama.desc":
    "Ajuan kerja sama UMKM, program kampus/KKN, liputan media, dan kegiatan desa lainnya.",
  "kontak.topic.kerjasama.n1": "Nama lembaga / instansi",
  "kontak.topic.kerjasama.n2": "Bentuk kerja sama yang diajukan",
  "kontak.topic.kerjasama.n3": "Rentang waktu pelaksanaan",
  "kontak.topic.kerjasama.msg":
    "Halo Candi Mulyo Park Tour, saya ingin mengajukan kerja sama. Instansi: ..., bentuk kerja sama: ...",

  "kontak.ch.waMsg":
    "Halo Candi Mulyo Park Tour, saya ingin bertanya tentang kunjungan dan produk desa wisata.",

  "kontak.formTitle": "Kirim Pesan",
  "kontak.formSub":
    "Isi formulir singkat ini, lalu pesan Anda akan diteruskan ke WhatsApp pengelola dalam format yang sudah rapi.",
  "kontak.form.name": "Nama lengkap",
  "kontak.form.namePh": "Nama Anda",
  "kontak.form.contact": "Nomor WA / email",
  "kontak.form.contactPh": "08xxxxxxxxxx",
  "kontak.form.topic": "Keperluan",
  "kontak.form.topicPh": "Pilih keperluan",
  "kontak.form.date": "Rencana tanggal (opsional)",
  "kontak.form.people": "Jumlah orang (opsional)",
  "kontak.form.peoplePh": "Contoh: 10",
  "kontak.form.message": "Pesan",
  "kontak.form.messagePh": "Tuliskan detail kebutuhan Anda...",
  "kontak.form.submit": "Kirim via WhatsApp",
  "kontak.form.note":
    "Formulir ini tidak menyimpan data; pesan langsung dibuka di WhatsApp Anda.",
  "kontak.form.waName": "Nama",
  "kontak.form.waContact": "Kontak",
  "kontak.form.waTopic": "Keperluan",
  "kontak.form.waDate": "Rencana tanggal",
  "kontak.form.waPeople": "Jumlah orang",

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
  "footer.madeFor": "Made for Candi Mulyo Tourism Village.",

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
    "From cultural heritage to fresh garden produce, enjoy it all at Candi Mulyo Park Tour.",
  "home.more": "Learn more",
  "home.featuredHeading": "Featured Products",
  "home.featuredEyebrow": "Fruits & Plants",
  // Immersive home (Candi Mulyo Park)
  "home.heroLine1": "Explore the Harmony",
  "home.heroLine2": "of Nature & Culture",
  "home.heroSub":
    "Find peace of mind through an exclusive blend of sacred Javanese wisdom and the serene natural beauty of Candi Mulyo Park Tour.",
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
    "Hello, I would like to ask about visiting Candi Mulyo Park Tour.",

  // Village profile (home) — example figures, easy to edit
  "home.desaEyebrow": "Village Profile",
  "home.desaTitle": "About Candi Mulyo Tourism Village",
  "home.desaBody1":
    "Candi Mulyo Tourism Village blends the preservation of Javanese culture with the beauty of its agrarian landscape. Here, the heritage of the keris, a traditional archery range, and gardens of fruit and plants live side by side in harmony.",
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
    "Hello Candi Mulyo Park Tour, I would like to learn more about the village profile and visiting.",
  "home.desaLocation": "Sleman, Yogyakarta",
  "home.desaCaption": "Candi Mulyo Tourism Village panorama",

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
    "Choice fruits from the Candi Mulyo Tourism Village gardens, harvested and delivered fresh.",
  "buah.catHeading": "Fresh Fruit Catalogue",
  "buah.catEyebrow": "Shop Fruits",
  "tumbuhan.eyebrow": "Candi Mulyo Nursery",
  "tumbuhan.title": "Plants",
  "tumbuhan.subtitle":
    "Ornamental plants, bonsai, succulents, and choice seedlings to beautify your home and garden.",
  "tumbuhan.catHeading": "Plant Catalogue",
  "tumbuhan.catEyebrow": "Shop Plants",

  // Keris page
  "keris.eyebrow": "Cultural Preservation",
  "keris.title": "Heirloom Keris Gallery",
  "keris.subtitle":
    "A collection of long-preserved keris owned by Candi Mulyo Tourism Village, displayed to introduce its cultural heritage to visitors.",
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

  // Contact page
  "kontak.eyebrow": "Information Center",
  "kontak.title": "Contact Us",
  "kontak.subtitle":
    "Reach us for visit reservations, archery packages, or fruit & plant orders.",

  "kontak.mgrTitle": "Manager Information",
  "kontak.mgrSub":
    "Feel free to reach us on WhatsApp or by direct phone call.",
  "kontak.addressLabel": "Location Address",
  "kontak.ctaWa": "Chat on WhatsApp",
  "kontak.ctaCall": "Call",
  "kontak.openMaps": "Open in Google Maps",
  "kontak.mapTitle": "Candi Mulyo Park Tour location map",

  "kontak.needEyebrow": "Your Needs",
  "kontak.needTitle": "How can we help?",
  "kontak.needSub":
    "To get a fast and accurate reply, choose one of the topics below and prepare the required details.",
  "kontak.needList": "Please prepare",
  "kontak.topicCta": "Chat on WhatsApp",

  "kontak.topic.panahan.title": "Archery Reservation",
  "kontak.topic.panahan.desc":
    "Book an archery package at our traditional range, including group visits.",
  "kontak.topic.panahan.n1": "Visit date & time",
  "kontak.topic.panahan.n2": "Number of participants & chosen package",
  "kontak.topic.panahan.n3": "Booking name & reachable phone number",
  "kontak.topic.panahan.msg":
    "Hello Candi Mulyo Park Tour, I would like to book an archery package. Date: ..., participants: ..., package: ...",

  "kontak.topic.keris.title": "Keris Gallery Visit",
  "kontak.topic.keris.desc":
    "Cultural tours, school education sessions, or guided visits to the heritage keris gallery.",
  "kontak.topic.keris.n1": "Planned date & time",
  "kontak.topic.keris.n2": "Number of visitors / institution",
  "kontak.topic.keris.n3": "Guide or education session needed",
  "kontak.topic.keris.msg":
    "Hello Candi Mulyo Park Tour, I would like to arrange a visit to the keris gallery. Date: ..., visitors: ...",

  "kontak.topic.belanja.title": "Fruit & Plant Orders",
  "kontak.topic.belanja.desc":
    "Order fresh fruits, ornamental plants, bonsai, and seedlings, including delivery outside the village.",
  "kontak.topic.belanja.n1": "Product name & quantity",
  "kontak.topic.belanja.n2": "Delivery address or pickup plan",
  "kontak.topic.belanja.n3": "Preferred payment method",
  "kontak.topic.belanja.msg":
    "Hello Candi Mulyo Park Tour, I would like to order fruits/plants. Product: ..., quantity: ..., delivery address: ...",

  "kontak.topic.kerjasama.title": "Partnership & Media",
  "kontak.topic.kerjasama.desc":
    "Proposals for MSME partnerships, campus programs, media coverage, and other village activities.",
  "kontak.topic.kerjasama.n1": "Institution name",
  "kontak.topic.kerjasama.n2": "Type of partnership proposed",
  "kontak.topic.kerjasama.n3": "Planned timeline",
  "kontak.topic.kerjasama.msg":
    "Hello Candi Mulyo Park Tour, I would like to propose a partnership. Institution: ..., type: ...",

  "kontak.ch.waMsg":
    "Hello Candi Mulyo Park Tour, I would like to ask about visiting and village products.",

  "kontak.formTitle": "Send a Message",
  "kontak.formSub":
    "Fill in this short form and your message will be forwarded to our WhatsApp in a tidy format.",
  "kontak.form.name": "Full name",
  "kontak.form.namePh": "Your name",
  "kontak.form.contact": "WhatsApp / email",
  "kontak.form.contactPh": "08xxxxxxxxxx",
  "kontak.form.topic": "Topic",
  "kontak.form.topicPh": "Choose a topic",
  "kontak.form.date": "Planned date (optional)",
  "kontak.form.people": "Number of people (optional)",
  "kontak.form.peoplePh": "e.g. 10",
  "kontak.form.message": "Message",
  "kontak.form.messagePh": "Describe what you need...",
  "kontak.form.submit": "Send via WhatsApp",
  "kontak.form.note":
    "This form stores no data; your message opens directly in WhatsApp.",
  "kontak.form.waName": "Name",
  "kontak.form.waContact": "Contact",
  "kontak.form.waTopic": "Topic",
  "kontak.form.waDate": "Planned date",
  "kontak.form.waPeople": "Number of people",

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
