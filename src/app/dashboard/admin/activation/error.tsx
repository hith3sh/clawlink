"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ActivationAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Activation dashboard error:", error);
  }, [error]);

  return (
    <Card className="border border-destructive/30 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TriangleAlert className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle>Activation dashboard failed to load</CardTitle>
            <CardDescription>
              The route rendered, but one of the server queries failed. Retry once before debugging the underlying data source.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </CardContent>
    </Card>
  );
}
