import { LayoutDashboard } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SkeletonCard } from "./SkeletonCard";

interface RouteFallbackProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Jumlah kartu skeleton yang ditampilkan di bawah banner. */
  cards?: number;
}

// Fallback untuk React.lazy + Suspense.
// Memakai PageBanner + SkeletonCard yang sudah ada supaya kerangka halaman
// langsung tampil (bukan layar kosong / spinner polos), sehingga tidak ada
// kedipan saat bundle rute dimuat.
export function RouteFallback({
  eyebrow = "Memuat",
  title = "Menyiapkan halaman",
  subtitle = "Mohon tunggu sebentar.",
  cards = 6,
}: RouteFallbackProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner icon={LayoutDashboard} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: cards }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Fallback ringan untuk panel di dalam halaman (tanpa banner), dipakai saat
// tab admin Keris / Panahan dimuat.
export function PanelFallback({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
