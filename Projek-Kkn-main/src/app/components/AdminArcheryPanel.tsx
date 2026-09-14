import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Target } from "lucide-react";
import {
  fetchArcheryPackages,
  saveArcheryPackage,
  deleteArcheryPackage,
  type ArcheryPackageRow,
} from "../../lib/db";
import { formatRupiah } from "../../lib/products";

type Draft = Partial<ArcheryPackageRow> & { includesText?: string };

const EMPTY: Draft = {
  name: "",
  tagline: "",
  price: 0,
  duration: "",
  arrows: "",
  capacity: "",
  includesText: "",
  description: "",
  popular: false,
  active: true,
  sort: 0,
};

export function AdminArcheryPanel() {
  const [items, setItems] = useState<ArcheryPackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const rows = await fetchArcheryPackages(true);
    setItems(rows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: ArcheryPackageRow) => {
    setEditing({ ...row, includesText: (row.includes ?? []).join("\n") });
  };

  const onSave = async () => {
    if (!editing || !editing.name?.trim()) {
      setError("Nama paket wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    const includes = (editing.includesText ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const { includesText, ...rest } = editing;
    const { error } = await saveArcheryPackage({ ...rest, includes });
    setSaving(false);
    if (error) {
      setError(error);
      return;
    }
    setEditing(null);
    load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Hapus paket panahan ini?")) return;
    const { error } = await deleteArcheryPackage(id);
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
          <h2 className="font-display text-2xl text-foreground">Paket Panahan</h2>
          <p className="text-sm text-muted-foreground">Kelola paket wahana panahan (1, 2, 3).</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Tambah Paket
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
          <Target size={32} className="mx-auto mb-2 opacity-50" />
          <p>Belum ada paket. Jalankan SQL upgrade atau tambah manual.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-medium text-foreground">{p.name}</h3>
                <div className="flex items-center gap-1">
                  {p.popular && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Populer</span>}
                  {!p.active && <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Nonaktif</span>}
                </div>
              </div>
              <p className="font-display text-xl text-foreground">{formatRupiah(p.price)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.duration ?? "-"} · {p.capacity ?? "-"} · {p.arrows ?? "-"}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => startEdit(p)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-secondary/70"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={13} /> Hapus
                </button>
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
                {editing.id ? "Edit Paket" : "Tambah Paket"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Nama Paket">
                <input className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Harga (Rp)">
                  <input type="number" className={inputCls} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </Field>
                <Field label="Durasi">
                  <input className={inputCls} value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
                </Field>
                <Field label="Jumlah Anak Panah">
                  <input className={inputCls} value={editing.arrows ?? ""} onChange={(e) => setEditing({ ...editing, arrows: e.target.value })} />
                </Field>
                <Field label="Kapasitas">
                  <input className={inputCls} value={editing.capacity ?? ""} onChange={(e) => setEditing({ ...editing, capacity: e.target.value })} />
                </Field>
              </div>
              <Field label="Termasuk (satu item per baris)">
                <textarea className={inputCls} rows={4} value={editing.includesText ?? ""} onChange={(e) => setEditing({ ...editing, includesText: e.target.value })} />
              </Field>
              <Field label="Deskripsi">
                <textarea className={inputCls} rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-3 items-end">
                <Field label="Urutan">
                  <input type="number" className={inputCls} value={editing.sort ?? 0} onChange={(e) => setEditing({ ...editing, sort: Number(e.target.value) })} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-foreground pb-2">
                  <input type="checkbox" checked={!!editing.popular} onChange={(e) => setEditing({ ...editing, popular: e.target.checked })} />
                  Populer
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground pb-2">
                  <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                  Aktif
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
