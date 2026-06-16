// =============================================================
// Sumber data produk terpusat untuk FreshGrove.
// Pendekatan HYBRID: aplikasi mencoba mengambil dari tabel
// Supabase `products`; jika belum dikonfigurasi / kosong / gagal,
// otomatis memakai SEED_PRODUCTS di bawah ini sebagai fallback,
// sehingga website tetap tampil sempurna tanpa database.
// =============================================================

export interface Nutrition {
  calories?: number; // kkal per 100g
  vitaminC?: number; // mg per 100g
  fiber?: number; // gram per 100g
  sugar?: number; // gram per 100g
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number; // untuk menampilkan diskon
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  badge?: string;
  badgeColor?: string;
  origin: string;
  description?: string;
  stock?: number;
  tags?: string[];
  nutrition?: Nutrition;
  // Lini produk: "buah" (default) atau "tumbuhan".
  type?: "buah" | "tumbuhan";
}

// Alias agar kompatibel dengan kode lama yang memakai `Fruit`.
export type Fruit = Product;

export const CATEGORIES = ["All", "Tropical", "Berries", "Citrus", "Seasonal"] as const;

// Kategori untuk lini Tumbuhan (halaman /tumbuhan).
export const PLANT_CATEGORIES = ["All", "Tanaman Hias", "Bonsai", "Sukulen & Kaktus", "Herbal"] as const;

export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Alphonso Mango",
    category: "Tropical",
    price: 32000,
    oldPrice: 40000,
    unit: "per kg",
    rating: 4.9,
    reviews: 248,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=700&h=700&fit=crop&auto=format",
    badge: "Best Seller",
    badgeColor: "#F4A623",
    origin: "Ratnagiri, India",
    description: "Mangga Alphonso premium dengan daging tebal, manis legit, dan aroma harum khas. Dipanen matang pohon untuk rasa terbaik.",
    stock: 40,
    tags: ["Manis", "Juicy", "Premium"],
    nutrition: { calories: 60, vitaminC: 36, fiber: 1.6, sugar: 14 },
  },
  {
    id: 2,
    name: "Dragon Fruit",
    category: "Tropical",
    price: 45000,
    unit: "per pcs",
    rating: 4.7,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=700&h=700&fit=crop&auto=format",
    badge: "Exotic",
    badgeColor: "#E63946",
    origin: "Vietnam",
    description: "Buah naga merah dengan daging berair, manis menyegarkan, dan kaya antioksidan. Cantik untuk smoothie bowl.",
    stock: 25,
    tags: ["Antioksidan", "Segar"],
    nutrition: { calories: 50, vitaminC: 9, fiber: 3, sugar: 8 },
  },
  {
    id: 3,
    name: "Strawberry",
    category: "Berries",
    price: 28000,
    oldPrice: 35000,
    unit: "per 250g",
    rating: 4.8,
    reviews: 315,
    image: "https://images.unsplash.com/photo-1543528176-61b239494933?w=700&h=700&fit=crop&auto=format",
    badge: "Fresh Today",
    badgeColor: "#2D6A4F",
    origin: "Cameron Highlands",
    description: "Stroberi dataran tinggi yang dipetik pagi hari. Manis-asam seimbang, merah merona, dan wangi.",
    stock: 60,
    tags: ["Vitamin C", "Manis-Asam"],
    nutrition: { calories: 33, vitaminC: 59, fiber: 2, sugar: 5 },
  },
  {
    id: 4,
    name: "Rambutan",
    category: "Tropical",
    price: 18000,
    unit: "per kg",
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&h=700&fit=crop&auto=format",
    origin: "Kalimantan",
    description: "Rambutan lokal manis dengan daging kenyal dan mudah lepas dari biji. Favorit musiman keluarga.",
    stock: 80,
    tags: ["Lokal", "Manis"],
    nutrition: { calories: 68, vitaminC: 5, fiber: 0.9, sugar: 13 },
  },
  {
    id: 5,
    name: "Valencia Orange",
    category: "Citrus",
    price: 22000,
    unit: "per kg",
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=700&h=700&fit=crop&auto=format",
    badge: "Vitamin C+",
    badgeColor: "#F4A623",
    origin: "Malang, Java",
    description: "Jeruk Valencia berair penuh, manis menyegarkan, ideal untuk jus segar tiap pagi.",
    stock: 100,
    tags: ["Juicy", "Vitamin C"],
    nutrition: { calories: 47, vitaminC: 53, fiber: 2.4, sugar: 9 },
  },
  {
    id: 6,
    name: "Blueberry",
    category: "Berries",
    price: 55000,
    unit: "per 200g",
    rating: 4.9,
    reviews: 177,
    image: "https://images.unsplash.com/photo-1457296898342-cdd24585d095?w=700&h=700&fit=crop&auto=format",
    badge: "Antioxidant",
    badgeColor: "#5C6BC0",
    origin: "Imported",
    description: "Blueberry impor pilihan, padat antioksidan, manis lembut. Sempurna untuk sarapan sehat.",
    stock: 35,
    tags: ["Antioksidan", "Superfood"],
    nutrition: { calories: 57, vitaminC: 10, fiber: 2.4, sugar: 10 },
  },
  {
    id: 7,
    name: "Pomelo",
    category: "Citrus",
    price: 25000,
    unit: "per pcs",
    rating: 4.5,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=700&h=700&fit=crop&auto=format",
    origin: "Bali",
    description: "Jeruk Bali besar dengan daging renyah, manis sedikit pahit yang khas dan menyegarkan.",
    stock: 45,
    tags: ["Segar", "Renyah"],
    nutrition: { calories: 38, vitaminC: 61, fiber: 1, sugar: 8 },
  },
  {
    id: 8,
    name: "Durian Monthong",
    category: "Tropical",
    price: 75000,
    oldPrice: 90000,
    unit: "per kg",
    rating: 4.8,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1616096142563-ce95f7932c72?w=700&h=700&fit=crop&auto=format",
    badge: "Premium",
    badgeColor: "#2D6A4F",
    origin: "Thailand",
    description: "Durian Monthong daging tebal, lembut, manis legit dengan aroma kuat. Raja buah sejati.",
    stock: 18,
    tags: ["Premium", "Creamy"],
    nutrition: { calories: 147, vitaminC: 20, fiber: 3.8, sugar: 27 },
  },
  {
    id: 9,
    name: "Lychee",
    category: "Seasonal",
    price: 38000,
    unit: "per kg",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=700&h=700&fit=crop&auto=format",
    badge: "In Season",
    badgeColor: "#E63946",
    origin: "China",
    description: "Leci segar musiman dengan daging bening berair dan manis floral. Stok terbatas.",
    stock: 30,
    tags: ["Musiman", "Floral"],
    nutrition: { calories: 66, vitaminC: 71, fiber: 1.3, sugar: 15 },
  },
  {
    id: 10,
    name: "Kiwi Gold",
    category: "Seasonal",
    price: 42000,
    unit: "per 3 pcs",
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=700&h=700&fit=crop&auto=format",
    origin: "New Zealand",
    description: "Kiwi emas dengan daging kuning manis, lembut, dan rendah asam. Kaya vitamin C.",
    stock: 50,
    tags: ["Vitamin C", "Manis"],
    nutrition: { calories: 60, vitaminC: 92, fiber: 3, sugar: 12 },
  },
  {
    id: 11,
    name: "Papaya California",
    category: "Tropical",
    price: 16000,
    unit: "per kg",
    rating: 4.5,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=700&h=700&fit=crop&auto=format",
    origin: "West Java",
    description: "Pepaya California ukuran pas, daging oranye manis dan lembut. Bagus untuk pencernaan.",
    stock: 70,
    tags: ["Lokal", "Sehat"],
    nutrition: { calories: 43, vitaminC: 62, fiber: 1.7, sugar: 8 },
  },
  {
    id: 12,
    name: "Raspberry",
    category: "Berries",
    price: 62000,
    unit: "per 150g",
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700&h=700&fit=crop&auto=format",
    badge: "New",
    badgeColor: "#E63946",
    origin: "Imported",
    description: "Raspberry merah impor, manis-asam menyegarkan dengan tekstur lembut. Cantik untuk dessert.",
    stock: 22,
    tags: ["Baru", "Premium"],
    nutrition: { calories: 52, vitaminC: 26, fiber: 6.5, sugar: 4 },
  },
  // ---- Tumbuhan (fallback bila database belum terisi) ----
  {
    id: 101,
    name: "Monstera Deliciosa",
    category: "Tanaman Hias",
    price: 120000,
    unit: "per pot",
    rating: 4.8,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Feuille%20Monstera%20deliciosa.jpg?width=700",
    badge: "Populer",
    badgeColor: "#2D6A4F",
    origin: "Nursery Martani",
    description: "Tanaman hias daun ikonik berlubang alami, mudah dirawat dan menyegarkan ruangan.",
    stock: 25,
    tags: ["Indoor", "Populer"],
    type: "tumbuhan",
  },
  {
    id: 102,
    name: "Lidah Mertua (Sansevieria)",
    category: "Tanaman Hias",
    price: 65000,
    unit: "per pot",
    rating: 4.7,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Snake%20plant.jpg?width=700",
    origin: "Nursery Martani",
    description: "Tanaman penyaring udara yang sangat tahan banting, cocok untuk pemula.",
    stock: 40,
    tags: ["Indoor", "Tahan Banting"],
    type: "tumbuhan",
  },
  {
    id: 103,
    name: "Aglaonema Merah",
    category: "Tanaman Hias",
    price: 95000,
    unit: "per pot",
    rating: 4.8,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aglaonema%20modestum.jpg?width=700",
    badge: "Favorit",
    badgeColor: "#E63946",
    origin: "Nursery Martani",
    description: "Aglaonema dengan corak daun cantik, primadona koleksi tanaman hias.",
    stock: 18,
    tags: ["Indoor", "Berwarna"],
    type: "tumbuhan",
  },
  {
    id: 104,
    name: "Anggrek Bulan",
    category: "Tanaman Hias",
    price: 85000,
    unit: "per pot",
    rating: 4.9,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Anggrek%20Bulan.jpg?width=700",
    origin: "Kebun Martani",
    description: "Anggrek bulan (Phalaenopsis), bunga pesona nasional Indonesia yang elegan.",
    stock: 22,
    tags: ["Bunga", "Elegan"],
    type: "tumbuhan",
  },
  {
    id: 105,
    name: "Bonsai Beringin",
    category: "Bonsai",
    price: 350000,
    unit: "per pot",
    rating: 4.9,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Acer%20palmatum-Bonsai.jpg?width=700",
    badge: "Premium",
    badgeColor: "#C9A227",
    origin: "Kebun Martani",
    description: "Bonsai dengan bentuk artistik, mahakarya hidup untuk penghias ruangan premium.",
    stock: 8,
    tags: ["Premium", "Seni"],
    type: "tumbuhan",
  },
  {
    id: 106,
    name: "Kaktus Mini",
    category: "Sukulen & Kaktus",
    price: 25000,
    unit: "per pot",
    rating: 4.6,
    reviews: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Small%20size%20cactus%20assortment%20in%20a%20pot.jpg?width=700",
    origin: "Nursery Martani",
    description: "Kaktus mini lucu dalam pot, perawatan super mudah dan cocok untuk meja kerja.",
    stock: 60,
    tags: ["Mini", "Mudah Rawat"],
    type: "tumbuhan",
  },
];

/** Map sebuah row dari Supabase ke tipe Product. */
export function mapRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    category: String(row.category ?? "Tropical"),
    type: row.type === "tumbuhan" ? "tumbuhan" : "buah",
    price: Number(row.price ?? 0),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    unit: String(row.unit ?? "per kg"),
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.reviews ?? 0),
    image: String(row.image ?? ""),
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : undefined,
    badge: row.badge ? String(row.badge) : undefined,
    badgeColor: row.badge_color ? String(row.badge_color) : undefined,
    origin: String(row.origin ?? ""),
    description: row.description ? String(row.description) : undefined,
    stock: row.stock != null ? Number(row.stock) : undefined,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : undefined,
    nutrition: (row.nutrition as Nutrition) ?? undefined,
  };
}
