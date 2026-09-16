import { useNavigate } from "react-router";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { SITE } from "../../lib/config";

// Halaman Kebijakan Privasi.
// Wajib ada karena situs mengumpulkan data pribadi (nama, telepon, alamat);
// UU No. 27/2022 (PDP) mewajibkan pemberitahuan tujuan pemrosesan & hak subjek data.
export function PrivacyPage() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen, cartItems, changeQty, removeFromCart, totalCount } = useCart();

  useDocumentMeta({
    title: "Kebijakan Privasi",
    description:
      "Bagaimana " + SITE.name + " mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar cartCount={totalCount} onCartClick={() => setCartOpen(true)} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-grad-leaf flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Kebijakan Privasi</h1>
            <p className="text-sm text-muted-foreground">
              Terakhir diperbarui: {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-lg text-foreground mb-2">1. Data yang kami kumpulkan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Data akun:</strong> email dan kata sandi (kata
                sandi disimpan ter-hash oleh penyedia autentikasi, kami tidak dapat melihatnya).
              </li>
              <li>
                <strong className="text-foreground">Data profil:</strong> nama, nomor telepon,
                alamat, kota, kode pos &mdash; hanya bila Anda mengisinya.
              </li>
              <li>
                <strong className="text-foreground">Data pesanan:</strong> daftar produk, jumlah,
                total, metode pembayaran, dan status pesanan.
              </li>
              <li>
                <strong className="text-foreground">Data ulasan:</strong> rating, komentar, dan nama
                tampilan yang Anda pilih.
              </li>
              <li>
                <strong className="text-foreground">Preferensi perangkat:</strong> keranjang,
                wishlist, tema, dan bahasa disimpan di penyimpanan lokal peramban Anda, bukan di
                server kami.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">2. Tujuan penggunaan</h2>
            <p>
              Data dipakai untuk memproses pesanan, mengirim produk, memverifikasi pembayaran,
              menampilkan riwayat pesanan, dan menjawab pertanyaan Anda. Kami tidak menjual atau
              menyewakan data pribadi Anda kepada pihak mana pun.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">3. Pihak ketiga</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-foreground">Supabase</strong> &mdash; basis data,
                autentikasi, dan penyimpanan gambar.
              </li>
              <li>
                <strong className="text-foreground">Midtrans</strong> &mdash; pemrosesan pembayaran.
                Kredensial pembayaran Anda diproses langsung oleh Midtrans dan tidak pernah melewati
                atau tersimpan di sistem kami.
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> &mdash; hosting situs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">4. Keamanan</h2>
            <p>
              Lalu lintas situs dienkripsi melalui HTTPS. Akses data dibatasi di tingkat basis data
              sehingga setiap pengguna hanya dapat membaca dan mengubah datanya sendiri; data
              pesanan orang lain tidak dapat diakses. Status pembayaran hanya dapat diubah oleh
              pengelola atau oleh notifikasi resmi Midtrans yang tanda tangannya sudah diverifikasi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">5. Hak Anda</h2>
            <p>
              Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak mengakses,
              memperbaiki, dan meminta penghapusan data pribadi Anda serta menarik persetujuan.
              Nama, telepon, dan alamat dapat Anda ubah sendiri di halaman Profil. Untuk penghapusan
              akun beserta seluruh datanya, hubungi {SITE.email} atau {SITE.phoneDisplay}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">6. Penyimpanan data</h2>
            <p>
              Data pesanan disimpan selama diperlukan untuk pencatatan dan penyelesaian sengketa.
              Data profil disimpan selama akun Anda aktif.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-foreground mb-2">7. Kontak</h2>
            <p>
              Penanggung jawab: {SITE.managerName}. Email: {SITE.email}. Telepon/WhatsApp:{" "}
              {SITE.phoneDisplay}. Alamat: {SITE.address}.
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
