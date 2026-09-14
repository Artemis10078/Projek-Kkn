import type { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  /** delay dalam ms */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}

/** Membungkus konten dengan efek scroll-reveal yang halus. */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const Tag = as as "div";
  const style = { transitionDelay: `${delay}ms` };

  return (
    <Tag
      ref={ref}
      style={style}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
