import { useEffect, useState } from "react";
import { Star, Send, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchReviews, upsertReview, type ReviewRow } from "../../lib/db";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ReviewsSection({ productId }: { productId: number }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchReviews(productId)
      .then((r) => setReviews(r))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async () => {
    if (!user) return;
    setSaving(true);
    setMsg(null);
    const res = await upsertReview({
      productId,
      rating,
      comment: comment.trim(),
      userName: profile?.full_name || user.email || "Pengguna",
    });
    setSaving(false);
    if (res.error) {
      setMsg(res.error);
      return;
    }
    setComment("");
    setMsg("Ulasan tersimpan. Terima kasih!");
    load();
  };

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-primary" />
        <h3 className="font-display text-foreground">Ulasan Pembeli ({reviews.length})</h3>
      </div>

      {user ? (
        <div className="bg-secondary/50 rounded-2xl p-4 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Beri rating Anda</p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                aria-label={"Rating " + s}
              >
                <Star
                  size={22}
                  className={
                    (hover || rating) >= s
                      ? "fill-[#F4A623] stroke-[#F4A623]"
                      : "stroke-muted-foreground"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagikan pengalaman Anda tentang produk ini..."
            rows={3}
            className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary resize-none"
          />
          {msg && <p className="text-xs text-primary mt-2">{msg}</p>}
          <button
            onClick={submit}
            disabled={saving}
            className="mt-3 inline-flex items-center gap-2 bg-grad-leaf text-white text-sm font-semibold px-4 py-2 rounded-full hover:shadow-glow transition-all active:scale-95 disabled:opacity-60"
          >
            <Send size={14} /> {saving ? "Menyimpan..." : "Kirim Ulasan"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground bg-secondary/50 rounded-2xl p-4 mb-4">
          Masuk untuk memberikan ulasan dan rating produk ini.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat ulasan...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada ulasan. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{r.user_name || "Pengguna"}</span>
                <span className="text-[11px] text-muted-foreground">{formatDate(r.created_at)}</span>
              </div>
              <div className="flex items-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={r.rating >= s ? "fill-[#F4A623] stroke-[#F4A623]" : "stroke-muted-foreground"}
                  />
                ))}
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
