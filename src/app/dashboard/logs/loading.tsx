import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsLoading() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-72 mb-2" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-9 w-12" />
              <Skeleton className="h-4 w-full mt-3" />
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px_160px]">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>

      <Card className="border-white/8 bg-transparent">
        <CardContent className="flex min-h-80 flex-col items-center justify-center py-20 text-center">
          <Skeleton className="h-16 w-16 rounded-[24px]" />
          <Skeleton className="h-6 w-48 mt-5" />
          <Skeleton className="h-4 w-80 mt-3" />
        </CardContent>
      </Card>
    </div>
  );
}