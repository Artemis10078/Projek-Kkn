import { useEffect } from "react";
import { SITE } from "../../lib/config";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/**
 * Mengatur title, description, dan tag Open Graph per halaman.
 *
 * Catatan jujur: ini berjalan di sisi browser. Crawler yang tidak menjalankan
 * JavaScript (pratinjau tautan WhatsApp/Facebook) hanya membaca meta statis di
 * index.html. Untuk pratinjau per halaman yang sempurna dibutuhkan SSR/
 * prerender, yang berarti mengubah stack -- di luar lingkup permintaan.
 */
export function useDocumentMeta({
  title,
  description,
  structuredData,
}: {
  title: string;
  description?: string;
  structuredData?: Record<string, unknown>;
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} \u2014 ${SITE.name}` : SITE.name;
    document.title = fullTitle;
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:url", window.location.href);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }

    let script: HTMLScriptElement | null = null;
    if (structuredData) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.page = "true";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [title, description, JSON.stringify(structuredData ?? null)]);
}
