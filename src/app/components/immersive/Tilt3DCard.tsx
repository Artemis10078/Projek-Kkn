import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  /** Sudut kemiringan maksimum dalam derajat. */
  max?: number;
}

// Membungkus konten dengan efek miring 3D yang mengikuti kursor (parallax
// halus) untuk memberi kesan kedalaman/hidup pada kartu.
export function Tilt3DCard({ children, className = "", max = 7 }: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * max, ry: px * max, active: true });
  }

  function handleLeave() {
    setTilt({ rx: 0, ry: 0, active: false });
  }

  const style = {
    transform:
      "perspective(1100px) rotateX(" +
      tilt.rx.toFixed(2) +
      "deg) rotateY(" +
      tilt.ry.toFixed(2) +
      "deg)",
    transition: tilt.active
      ? "transform 0.08s ease-out"
      : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    transformStyle: "preserve-3d" as const,
    willChange: "transform",
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
