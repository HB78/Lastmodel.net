export function UserInfoSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-gray-200"></div>
          <div className="h-6 w-1/3 rounded bg-gray-200"></div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <div className="h-10 w-1/3 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}






























