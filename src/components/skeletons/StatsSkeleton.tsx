import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsSkeleton() {
  return (
    <>
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader>
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
        </CardContent>
      </Card>
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader>
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
        </CardContent>
      </Card>
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardHeader>
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
        </CardContent>
      </Card>
    </>
  );
}

