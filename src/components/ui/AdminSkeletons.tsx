import { Skeleton } from "./Skeleton";

export const StatsCardSkeleton = () => (
  <div className="bg-gray-700 rounded-lg p-6 text-center">
    <Skeleton className="w-8 h-8 mx-auto mb-2 rounded-full" />
    <Skeleton className="h-8 w-16 mx-auto mb-2" />
    <Skeleton className="h-4 w-24 mx-auto" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-600">
    <td className="p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-40" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </td>
  </tr>
);

export const UsersTableSkeleton = () => (
  <div className="bg-gray-700 rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-600">
        <tr>
          <th className="text-left p-4 text-gray-300">User</th>
          <th className="text-left p-4 text-gray-300">Email</th>
          <th className="text-left p-4 text-gray-300">Joined</th>
          <th className="text-left p-4 text-gray-300">Status</th>
          <th className="text-left p-4 text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export const SubscriptionsTableSkeleton = () => (
  <div className="bg-gray-700 rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-600">
        <tr>
          <th className="text-left p-4 text-gray-300">User</th>
          <th className="text-left p-4 text-gray-300">Plan</th>
          <th className="text-left p-4 text-gray-300">Amount</th>
          <th className="text-left p-4 text-gray-300">Status</th>
          <th className="text-left p-4 text-gray-300">Start Date</th>
          <th className="text-left p-4 text-gray-300">End Date</th>
          <th className="text-left p-4 text-gray-300">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="border-b border-gray-600">
            <td className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </td>
            <td className="p-4">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="p-4">
              <Skeleton className="h-4 w-16" />
            </td>
            <td className="p-4">
              <Skeleton className="h-6 w-16 rounded-full" />
            </td>
            <td className="p-4">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="p-4">
              <Skeleton className="h-4 w-20" />
            </td>
            <td className="p-4">
              <Skeleton className="h-8 w-8 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const RecentActivitySkeleton = () => (
  <div className="bg-gray-700 rounded-lg p-6">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-5 w-16 rounded-full ml-auto" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SearchBarSkeleton = () => (
  <div className="relative">
    <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded" />
    <Skeleton className="w-full h-12 rounded-md pl-10" />
  </div>
);

export const TabNavigationSkeleton = () => (
  <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} className="flex items-center gap-2 px-4 py-2 rounded-md w-24" />
    ))}
  </div>
);
