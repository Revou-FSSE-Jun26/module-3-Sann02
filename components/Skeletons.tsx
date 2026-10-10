/** Pulsing placeholders shaped like the real content; used by loading.tsx files. */

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <Block className="h-32" />
      <Block className="h-4 w-3/4" />
      <Block className="h-4 w-1/2" />
      <Block className="h-9" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        <Block key={i} className="h-16" />
      ))}
    </div>
  );
}

export function LoadingStatus({ label }: { label: string }) {
  return (
    <p role="status" className="text-sm font-medium text-blue-600">
      Loading {label}…
    </p>
  );
}

export { Block as SkeletonBlock };
