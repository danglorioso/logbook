import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileFormSkeleton() {
  return (
    <Card className="bg-[#0a0a0a] border-white/10">
      <CardHeader>
        <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Email field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
            <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Username field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
          </div>

          {/* First and Last name fields skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
            </div>
          </div>

          {/* Disable account section skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-5 w-5 rounded border-white/30 bg-white/10 animate-pulse" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-4 pt-4 justify-end">
            <div className="h-9 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-9 w-32 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

