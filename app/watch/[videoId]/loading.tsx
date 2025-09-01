export default function VideoDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* YouTube Video Embed Skeleton */}
        <div className="relative pt-[56.25%] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg overflow-hidden mb-6"></div>

        {/* Video Details Skeleton */}
        <div className="mb-8">
          {/* Title Skeleton */}
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg mb-4"></div>
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg mb-4"></div>

          {/* Channel and Buttons Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg mb-2 md:mb-0"></div>

            <div className="flex items-center space-x-2">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            </div>
          </div>

          {/* Description and Chat Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Description Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              </div>
            </div>

            {/* Chat Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-4 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              </div>

              <div className="h-96 p-4">
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 mb-12">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
