// Halaman 404 sederhana, mengikuti palet earthy yang sudah ada.
// Ditampilkan oleh route catch-all (path="*") di App.tsx.
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F] dark:text-[#52B788]">
        Kesalahan 404
      </p>
      <h1 className="mt-3 text-3xl font-bold text-foreground">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Alamat yang kamu buka tidak ada atau sudah dipindahkan. Kembali ke
        beranda untuk melanjutkan menjelajah Candimulyo Park Tour.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#40916C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D6A4F]"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
