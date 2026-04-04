import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IntegrationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <Card className="p-4 sm:p-5">
        <Skeleton className="h-12 w-full mb-5" />
        <Skeleton className="h-4 w-48 mb-5" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
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
    </div>
  );
}