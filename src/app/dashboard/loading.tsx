import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <Card className="p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <div className="space-y-5">
            <div>
              <Skeleton className="h-3 w-24 mb-4" />
              <Skeleton className="h-9 w-80 mb-3" />
              <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <Card className="p-4">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-5 w-48" />
            </Card>
            <Card className="p-4">
              <Skeleton className="h-3 w-32 mb-3" />
              <Skeleton className="h-5 w-full max-w-md" />
            </Card>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-9 w-12" />
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-4 sm:p-5">
          <Skeleton className="h-12 w-full mb-5" />
          <Skeleton className="h-4 w-48 mb-5" />
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-11 w-11 rounded-2xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="mt-5 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <Skeleton className="h-3 w-28 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/7 bg-white/[0.035]">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}