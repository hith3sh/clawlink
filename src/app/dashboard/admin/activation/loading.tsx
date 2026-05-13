import { Card, CardContent, CardHeader } from "@/components/ui/card";

function LoadingBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/60 ${className}`} />;
}

export default function ActivationAdminLoading() {
  return (
    <div className="space-y-6">
      <Card className="border border-border/60 bg-card/90">
        <CardHeader className="space-y-3">
          <LoadingBlock className="h-5 w-28" />
          <LoadingBlock className="h-8 w-64" />
          <LoadingBlock className="h-4 w-full max-w-3xl" />
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          <LoadingBlock className="h-24 w-full" />
          <LoadingBlock className="h-24 w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} className="border border-border/60 bg-card/90">
            <CardContent className="space-y-3 pt-4">
              <LoadingBlock className="h-4 w-32" />
              <LoadingBlock className="h-8 w-24" />
              <LoadingBlock className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-border/60 bg-card/90">
        <CardContent className="pt-4">
          <LoadingBlock className="h-[320px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
