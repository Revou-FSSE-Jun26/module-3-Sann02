import { ListSkeleton, LoadingStatus, SkeletonBlock } from "@/components/Skeletons";

export default function OrdersLoading() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-40" />
      <LoadingStatus label="orders" />
      <ListSkeleton rows={6} />
    </div>
  );
}
