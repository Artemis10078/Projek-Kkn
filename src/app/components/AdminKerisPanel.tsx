import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2, Sword } from "lucide-react";
import {
  fetchKeris,
  saveKeris,
  deleteKeris,
  uploadImage,
  type KerisRow,
} from "../../lib/db";

type Draft = Partial<KerisRow>;

const EMPTY: Draft = {
  name: "",
  era: "",
  origin: "",
  dapur: "",
  pamor: "",
  description: "",
  image: "",
  featured: false,
  sort: 0,
};

export function AdminKerisPanel() {
  const [items, setItems] = useState<KerisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const rows = await fetchKeris();
    setItems(rows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    const { url, error } = await uploadImage("product-images", file, "keris/");
    setUploading(false);
    if (error) {
      setError(error);
      return;
    }
    setEditing((d) => ({ ...(d ?? EMPTY), image: url ?? "" }));
  };

  const onSave = async () => {
    if (!editing || !editing.name?.trim()) {
      setError("Nama keris wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    const { error } = await saveKeris(editing);
    setSaving(false);
    if (error) {
      setError(error);
      return;
    }
    setEditing(null);
    load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Hapus keris ini dari galeri?")) return;
    const { error } = await deleteKeris(id);
    if (error) {
      setError(error);
      return;
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl text-foreground">Galeri Keris</h2>
          <p className="text-sm text-muted-foreground">Kelola koleksi keris pusaka yang dipamerkan.</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Tambah Keris
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
          <Loader2 size={18} className="animate-spin" /> Memuat...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Sword size={32} className="mx-auto mb-2 opacity-50" />
          <p>Belum ada keris. Jalankan SQL upgrade atau tambah manual.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((k) => (
            <div key={k.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[4/3] bg-secondary">
                {k.image ? (
                  <img src={k.image} alt={k.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Sword size={28} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">{k.name}</h3>
                  {k.featured && (
                    <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Unggulan</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {k.origin ?? "-"} · {k.era ?? "-"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setEditing(k)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/70"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(k.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div
            className="bg-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-foreground">
                {editing.id ? "Edit Keris" : "Tambah Keris"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Nama">
                <input className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Era / Abad">
                  <input className={inputCls} value={editing.era ?? ""} onChange={(e) => setEditing({ ...editing, era: e.target.value })} />
                </Field>
                <Field label="Asal">
                  <input className={inputCls} value={editing.origin ?? ""} onChange={(e) => setEditing({ ...editing, origin: e.target.value })} />
                </Field>
                <Field label="Dapur">
                  <input className={inputCls} value={editing.dapur ?? ""} onChange={(e) => setEditing({ ...editing, dapur: e.target.value })} />
                </Field>
                <Field label="Pamor">
                  <input className={inputCls} value={editing.pamor ?? ""} onChange={(e) => setEditing({ ...editing, pamor: e.target.value })} />
                </Field>
              </div>
              <Field label="Deskripsi">
                <textarea className={inputCls} rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <Field label="Gambar">
                <div className="flex items-center gap-3">
                  {editing.image ? (
                    <img src={editing.image} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                      <Sword size={20} />
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                  <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-secondary text-foreground">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Unggah
                  </button>
                </div>
                <input className={inputCls + " mt-2"} placeholder="atau tempel URL gambar" value={editing.image ?? ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3 items-end">
                <Field label="Urutan">
                  <input type="number" className={inputCls} value={editing.sort ?? 0} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-foreground pb-2">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Tampilkan sebagai unggulan
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground">
                Batal
              </button>
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />} Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
