export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-verde-muy-claro" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-verde-muy-claro" />
          <div className="h-4 w-full animate-pulse rounded bg-verde-muy-claro" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-verde-muy-claro" />
          <div className="h-24 w-full animate-pulse rounded bg-verde-muy-claro" />
          <div className="h-12 w-1/2 animate-pulse rounded bg-verde-muy-claro" />
        </div>
      </div>
    </div>
  );
}