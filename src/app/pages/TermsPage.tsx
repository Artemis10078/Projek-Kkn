import { useNavigate } from "react-router";
import { ScrollText } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { SITE } from "../../lib/config";

// Halaman Syarat & Ketentuan: aturan pemesanan, pembayaran, pembatalan,
// dan batas tanggung jawab. Penting karena situs menerima pembayaran nyata.
export function TermsPage() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen, cartItems, changeQty, removeFromCart, totalCount } = useCart();

  useDocumentMeta({
    title: "Syarat & Ketentuan",
    description: "Aturan pemesanan, pembayaran, pengiriman, dan pembatalan di " + SITE.name + ".",
  });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar cartCount={totalCount} onCartClick={() => setCartOpen(true)} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-grad-leaf flex items-center justify-center">
            <ScrollText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Syarat &amp; Ketentuan</h1>
            <p className="text-sm text-muted-foreground">
              Terakhir diperbarui: {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-lg text-foreground mb-2">1. Penerimaan</h2>
            <p>
              Dengan membuat akun atau memesan di {SITE.name}, Anda dianggap membaca dan menyetujui
              ketentuan ini beserta Kebijakan Privasi kami.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">2. Akun</h2>
            <p>
              Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda. Data yang Anda isi
              (nama, telepon, alamat) harus benar agar pesanan dapat dikirim.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">3. Harga dan ketersediaan</h2>
            <p>
              Harga dalam Rupiah dan dapat berubah tanpa pemberitahuan. Total yang berlaku adalah
              total yang dihitung sistem kami saat pesanan dibuat; bila harga di halaman sudah tidak
              sesuai, pesanan ditolak dan Anda diminta memuat ulang halaman.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">4. Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">QRIS (disarankan):</strong> pesanan tercatat
                dengan status Menunggu Pembayaran. Setelah Anda membayar, pengelola mencocokkan
                pembayaran lalu mengubah status. Verifikasi manual dilakukan pada jam kerja.
              </li>
              <li>
                <strong className="text-foreground">Midtrans:</strong> status diperbarui otomatis
                setelah pembayaran dikonfirmasi oleh Midtrans.
              </li>
              <li>
                Pesanan yang belum dibayar dalam 1x24 jam dapat dibatalkan pengelola dan stoknya
                dikembalikan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">5. Pengiriman</h2>
            <p>
              Ongkos kirim ditampilkan di halaman checkout sebelum pembayaran. Produk segar dikirim
              sesuai jadwal pengiriman lokal. Keterlambatan akibat kondisi di luar kendali kami
              (cuaca, kendala kurir) bukan tanggung jawab kami.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">
              6. Pembatalan dan pengembalian
            </h2>
            <p>
              Pembatalan dapat diajukan selama pesanan masih Menunggu Pembayaran atau belum dikirim.
              Untuk produk segar yang diterima dalam kondisi rusak, laporkan beserta foto dalam 1x24
              jam setelah barang diterima.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">7. Kunjungan wisata</h2>
            <p>
              Paket wisata dan panahan mengikuti jadwal serta kuota yang berlaku. Pengunjung wajib
              mengikuti arahan pemandu, terutama pada aktivitas panahan. Koleksi keris yang
              dipamerkan adalah benda budaya dan tidak diperjualbelikan kecuali dinyatakan lain.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">8. Ulasan pengguna</h2>
            <p>
              Ulasan harus relevan dan tidak memuat kata kasar, ujaran kebencian, data pribadi orang
              lain, atau promosi. Kami berhak menghapus ulasan yang melanggar ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">9. Kontak</h2>
            <p>
              Pertanyaan mengenai ketentuan ini: {SITE.email} atau {SITE.phoneDisplay} ({SITE.managerName}).
            </p>
          </section>
        </div>
      </div>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onQtyChange={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />
    </div>
  );
}
