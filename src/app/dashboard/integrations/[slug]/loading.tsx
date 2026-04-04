import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IntegrationDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
      </div>

      <Card className="p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-[22px]" />
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <Card className="p-4">
                <Skeleton className="h-4 w-full" />
              </Card>
            </div>
          </div>

          <Card className="p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.75fr)]">
        <Card className="p-6">
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-6 w-72 mb-2" />
          <Skeleton className="h-4 w-full max-w-lg mb-5" />
          <Skeleton className="h-10 w-44" />
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-5" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-full" />
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="h-3 w-28 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}