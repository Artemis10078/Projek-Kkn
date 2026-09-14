import type { LucideIcon } from "lucide-react";

interface PageBannerProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Background photo URL for this product line (clear, themed image). */
  image?: string;
  /** Fallback gradient (used under the photo, and shown if the photo fails). */
  fallback?: string;
}

// Immersive page banner: a themed background photo under a dark cinematic
// overlay with brass accents. Text stays light over the photo in BOTH light
// and dark mode, so it always reads cleanly.
export function PageBanner({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  image,
  fallback = "linear-gradient(135deg, #3b2a1a 0%, #1b4332 100%)",
}: PageBannerProps) {
  const overlay =
    "linear-gradient(180deg, rgba(10,16,11,0.55) 0%, rgba(10,16,11,0.72) 55%, rgba(10,16,11,0.9) 100%)";
  const bgImage = image
    ? overlay + ", url('" + image + "')"
    : overlay + ", " + fallback;
  const bannerStyle = {
    backgroundImage: bgImage,
    backgroundColor: "#10180f",
  };

  return (
    <section
      className="imm-media imm-grain relative overflow-hidden"
      style={bannerStyle}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="imm-pill w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5">
          <Icon size={30} className="text-[#f5bb89]" strokeWidth={1.5} />
        </div>
        <p className="text-[#f5bb89] text-sm font-semibold uppercase tracking-[0.22em] mb-2">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-white font-semibold mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/85 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="imm-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
