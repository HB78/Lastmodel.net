export function EditFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200"></div>
        <div className="mx-auto h-8 w-1/3 rounded bg-gray-200"></div>
        <div className="mx-auto h-5 w-1/2 rounded bg-gray-200"></div>
      </div>

      {/* Form skeleton */}
      <div className="space-y-6 rounded-lg border bg-white p-6">
        {/* Section 1: Basic info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name field */}
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>

          {/* Sex field */}
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>

          {/* Age field */}
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>

          {/* Phone field */}
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* City field */}
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>

          {/* Origin field */}
          <div className="space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Section 3: Description */}
        <div className="space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="h-32 rounded bg-gray-200"></div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex items-center gap-4 pt-4">
          <div className="h-12 flex-1 rounded bg-gray-200"></div>
          <div className="h-12 flex-1 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
