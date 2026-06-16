import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { Leaf, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Browser akan diarahkan ke Google, lalu kembali ke halaman ini
    } catch (err) {
      setError("Gagal login dengan Google. Coba lagi.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        navigate("/");
      }
    } else {
      if (!fullName.trim()) {
        setError("Nama lengkap wajib diisi.");
        setLoading(false);
        return;
      }
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setInfo("Pendaftaran berhasil! Silakan cek email kamu untuk verifikasi, lalu login.");
        setMode("login");
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4 py-12"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-3">
            <Leaf size={26} className="text-primary-foreground" />
          </div>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-primary">
            FreshGrove
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Masuk ke akun kamu" : "Buat akun baru"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-full py-3 font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Lanjutkan dengan Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-foreground mb-1.5 block">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama kamu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-input-background outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-input-background outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-input-background outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="text-sm text-primary bg-primary/10 rounded-lg px-3 py-2">{info}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(null); setInfo(null); }}
                  className="text-primary font-medium hover:underline"
                >
                  Daftar sekarang
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); setInfo(null); }}
                  className="text-primary font-medium hover:underline"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Kembali ke toko
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24 C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}
