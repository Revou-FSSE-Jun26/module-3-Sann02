import { LoadingStatus, ProductGridSkeleton, SkeletonBlock } from "@/components/Skeletons";

export default function ProductsLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-10" />
        <LoadingStatus label="products" />
        <ProductGridSkeleton />
      </div>
      <SkeletonBlock className="h-64" />
    </div>
  );
}
