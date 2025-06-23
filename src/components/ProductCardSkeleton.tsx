// components/ProductCardSkeleton.tsx
export function ProductCardSkeleton({ viewMode = "grid" }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "rounded-lg border p-4 animate-pulse space-y-4"
          : "flex border rounded-lg p-4 animate-pulse gap-4"
      }
    >
      <div
        className={
          viewMode === "grid"
            ? "h-40 bg-muted rounded-lg w-full"
            : "h-32 w-40 bg-muted rounded-lg"
        }
      />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}
