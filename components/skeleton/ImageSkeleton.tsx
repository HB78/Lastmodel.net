export function ImageSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-gray-200"></div>
          <div className="h-6 w-1/3 rounded bg-gray-200"></div>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded bg-gray-200"></div>
          <div className="aspect-square rounded bg-gray-200"></div>
          <div className="aspect-square rounded bg-gray-200"></div>
          <div className="aspect-square rounded bg-gray-200"></div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <div className="h-10 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
