import { LoadingStatus, ProductGridSkeleton, SkeletonBlock } from "@/components/Skeletons";

export default function HomeLoading() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-36" />
      <LoadingStatus label="featured products" />
      <ProductGridSkeleton count={5} />
    </div>
  );
}
