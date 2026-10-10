import { LoadingStatus, SkeletonBlock } from "@/components/Skeletons";

export default function ProductDetailLoading() {
  return (
    <div className="space-y-4">
      <LoadingStatus label="product" />
      <div className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-2">
        <SkeletonBlock className="h-64" />
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-6 w-1/3" />
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
