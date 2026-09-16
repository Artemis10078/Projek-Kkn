// Error boundary global: kalau satu komponen crash, pengunjung melihat
// pesan ramah + tombol muat ulang, bukan layar putih kosong.
import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Cukup di console lokal; jangan kirim detail internal ke UI.
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Terjadi kesalahan
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Maaf, ada gangguan saat menampilkan halaman ini. Coba muat ulang.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#2D6A4F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#40916C]"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
