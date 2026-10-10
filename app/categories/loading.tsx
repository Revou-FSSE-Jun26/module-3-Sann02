import { LoadingStatus, SkeletonBlock } from "@/components/Skeletons";

export default function CategoriesLoading() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-48" />
      <LoadingStatus label="categories" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBlock key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
