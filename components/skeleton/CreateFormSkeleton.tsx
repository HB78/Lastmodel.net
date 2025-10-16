export function CreateFormSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200"></div>
            <div className="mx-auto h-10 w-1/3 rounded bg-gray-200"></div>
            <div className="mx-auto h-6 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8 xl:col-span-3">
            {/* Form sections skeleton */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              {/* Section 1: Basic info */}
              <div className="space-y-6 rounded-lg border bg-white p-8">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>

              {/* Section 2: Location */}
              <div className="space-y-6 rounded-lg border bg-white p-8">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-12 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 & 4 */}
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
              {/* Description */}
              <div className="space-y-6 rounded-lg border bg-white p-8">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="h-32 rounded bg-gray-200"></div>
              </div>

              {/* Images */}
              <div className="space-y-6 rounded-lg border bg-white p-8">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
                <div className="h-32 rounded bg-gray-200"></div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col gap-4 pt-8 sm:flex-row">
              <div className="h-14 flex-1 rounded-xl bg-gray-200"></div>
              <div className="h-14 flex-1 rounded-xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
