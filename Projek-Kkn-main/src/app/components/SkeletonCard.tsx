/** Placeholder skeleton untuk kartu produk saat loading. */
export function SkeletonCard() {
  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border">
      <div className="skeleton aspect-square w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-5 w-1/3 rounded-full" />
          <div className="skeleton h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
