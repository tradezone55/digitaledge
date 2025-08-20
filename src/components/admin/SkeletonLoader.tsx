import { Skeleton } from "../ui/Skeleton";
import {
  RecentActivitySkeleton,
  SearchBarSkeleton,
  StatsCardSkeleton,
  TabNavigationSkeleton,
} from "../ui/AdminSkeletons";

const SkeletonLoader = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-6">
        <SearchBarSkeleton />
      </div>

      {/* Tab Navigation Skeleton */}
      <TabNavigationSkeleton />

      {/* Content Skeleton */}
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <RecentActivitySkeleton />
      </div>
    </div>
  );
};

export default SkeletonLoader;
