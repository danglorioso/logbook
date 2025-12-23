import { Card, CardContent } from "@/components/ui/card";

export function FlightCardSkeleton() {
  return (
    <Card className="bg-[#0a0a0a] border-white/10">
      <CardContent className="p-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
            <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-white/10 rounded-md animate-pulse" />
            <div className="h-9 w-9 bg-white/10 rounded-md animate-pulse" />
            <div className="h-9 w-9 bg-white/10 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Summary header skeleton */}
        <div className="flex flex-wrap gap-x-6 gap-y-4 pb-3 mb-4 border-b border-white/5">
          <div className="h-16 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-16 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-16 w-24 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <div className="flex gap-x-6">
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex gap-x-6 border-l border-white/5 pl-6">
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="flex gap-x-6 border-l border-white/5 pl-6">
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

