export default function WatchPageLoading() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      </div>

      {/* Video Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Thumbnail Skeleton */}
              <div className="relative pt-[56.25%] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              {/* Title Skeleton */}
              <div className="p-4">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-3"></div>
                <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-3"></div>
                {/* Channel and Date Skeleton */}
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
