import { lazy, Suspense, type ComponentProps, type ReactNode } from "react";

// Efek immersive (kanvas kabut & kartu miring 3D) hanya hiasan, tetapi
// ukurannya ikut menggelembungkan bundle awal. Di sini keduanya dimuat
// terpisah (code splitting) DENGAN fallback yang tetap menampilkan konten,
// sehingga tidak ada kedipan dan tidak ada fitur yang hilang.

const MistCanvasLazy = lazy(() =>
  import("./MistCanvas").then((m) => ({ default: m.MistCanvas })),
);

const Tilt3DCardLazy = lazy(() =>
  import("./Tilt3DCard").then((m) => ({ default: m.Tilt3DCard })),
);

// Props MistCanvas diteruskan apa adanya.
type MistProps = ComponentProps<typeof MistCanvasLazy>;

/**
 * Pengganti <MistCanvas> yang dimuat belakangan.
 * Fallback = null karena kanvas ini murni latar dekoratif; halaman tetap utuh.
 */
export function MistCanvas(props: MistProps) {
  return (
    <Suspense fallback={null}>
      <MistCanvasLazy {...props} />
    </Suspense>
  );
}

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

/**
 * Pengganti <Tilt3DCard> yang dimuat belakangan.
 * PENTING: fallback tetap merender children di dalam <div> dengan className
 * yang sama, jadi kartu langsung terlihat lengkap. Yang datang belakangan
 * hanya efek miringnya, bukan isinya -> nol flicker, nol layout shift.
 */
export function Tilt3DCard({ children, className = "", max }: TiltProps) {
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <Tilt3DCardLazy className={className} max={max}>
        {children}
      </Tilt3DCardLazy>
    </Suspense>
  );
}
