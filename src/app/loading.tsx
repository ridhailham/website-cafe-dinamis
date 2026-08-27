const Skeleton = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-md bg-stone-200 ${className}`}
    aria-hidden
  />
);

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Skeleton className="h-8 w-36" />
          <div className="flex items-center gap-6">
            <Skeleton className="hidden h-4 w-16 sm:block" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-5 px-4 text-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80 max-w-lg" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-44 rounded-full" />
          </div>
        </section>

        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 flex flex-col items-center gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-48" />
            </div>
            <div className="flex justify-center gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-0 shadow-sm"
                >
                  <Skeleton className="aspect-[3/2] w-full rounded-none" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
