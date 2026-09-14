import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { UserCog, Camera, Loader2, CheckCircle2, User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { updateProfile, uploadImage } from "../../lib/db";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    changeQty,
    removeFromCart,
    totalCount,
  } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setPostalCode(profile.postal_code || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    const res = await uploadImage("avatars", file, user.id + "/");
    setUploading(false);
    if (res.error || !res.url) {
      setError(res.error || "Gagal mengunggah foto.");
      return;
    }
    setAvatarUrl(res.url);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await updateProfile(user.id, {
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
      city: city.trim() || null,
      postal_code: postalCode.trim() || null,
      avatar_url: avatarUrl,
    });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar cartCount={totalCount} onCartClick={() => setCartOpen(true)} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-grad-leaf flex items-center justify-center">
            <UserCog size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Profil Saya</h1>
            <p className="text-sm text-muted-foreground">Kelola data diri dan alamat pengiriman</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-5 sm:p-7">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center border border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={30} className="text-muted-foreground" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-grad-leaf text-white flex items-center justify-center shadow hover:shadow-glow transition-all"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatar}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{profile?.email}</p>
              <p className="text-xs text-muted-foreground">Klik ikon kamera untuk mengganti foto</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Nama Lengkap" value={fullName} onChange={setFullName} placeholder="Nama Anda" />
            <Field label="Nomor Telepon" value={phone} onChange={setPhone} placeholder="08xxxxxxxxxx" />
            <Field label="Alamat" value={address} onChange={setAddress} placeholder="Jalan, nomor rumah, RT/RW" textarea />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kota / Kabupaten" value={city} onChange={setCity} placeholder="Kota" />
              <Field label="Kode Pos" value={postalCode} onChange={setPostalCode} placeholder="00000" />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 mt-4">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 bg-grad-leaf text-white py-3 rounded-full font-semibold hover:shadow-glow transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Menyimpan...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={16} /> Tersimpan
              </>
            ) : (
              <>Simpan Perubahan</>
            )}
          </button>
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

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}

function Field({ label, value, onChange, placeholder, textarea }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-secondary/40 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      )}
    </label>
  );
}
