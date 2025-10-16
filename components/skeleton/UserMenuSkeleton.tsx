export function UserMenuSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3">
      {/* Avatar skeleton */}
      <div className="h-8 w-8 rounded-full bg-gray-200"></div>

      {/* User name skeleton */}
      <div className="hidden sm:block">
        <div className="h-4 w-20 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo skeleton */}
          <div className="h-8 w-24 rounded bg-gray-200"></div>

          {/* User menu skeleton */}
          <UserMenuSkeleton />
        </div>
      </div>
    </nav>
  );
}
