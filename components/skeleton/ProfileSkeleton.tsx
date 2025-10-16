export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200"></div>
        <div className="mx-auto h-8 w-1/3 rounded bg-gray-200"></div>
        <div className="mx-auto h-5 w-1/2 rounded bg-gray-200"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* User info card */}
        <div className="space-y-4 rounded-lg border bg-white p-6">
          <div className="h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Contact card */}
        <div className="space-y-4 rounded-lg border bg-white p-6">
          <div className="h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="space-y-4 rounded-lg border bg-white p-6">
        <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
