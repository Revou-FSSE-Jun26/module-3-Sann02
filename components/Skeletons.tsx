/** Premium pulsing/shimmer skeleton placeholders. */

/** Shimmer block — gradient sweep animation */
function ShimmerBlock({ className }: { className: string }) {
  return (
    <div
      className={`overflow-hidden rounded-lg ${className}`}
      style={{ background: "#f1f5f9" }}
    >
      <div
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 40%, #f1f5f9 80%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* Image */}
      <ShimmerBlock className="aspect-square w-full" />
      {/* Content */}
      <div className="space-y-2.5 p-3.5">
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <ShimmerBlock className="h-5 w-1/3" />
          <ShimmerBlock className="h-3 w-1/4" />
        </div>
        <ShimmerBlock className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <ShimmerBlock key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

export function LoadingStatus({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-semibold text-brand-600">Loading {label}…</p>
    </div>
  );
}

export { ShimmerBlock as SkeletonBlock };
