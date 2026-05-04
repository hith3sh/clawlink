"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface AppRequest {
  id: number;
  user_id: string;
  email: string;
  toolkit_name: string;
  use_case: string;
  votes: number;
  created_at: string;
  userVoted: boolean;
}


export default function RequestAppPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState(
    user?.emailAddresses?.[0]?.emailAddress || ""
  );
  const [toolkitName, setToolkitName] = useState("");
  const [useCase, setUseCase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/app-requests");
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as { requests: AppRequest[] };
      setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRequests();
  }, [fetchRequests]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!toolkitName.trim()) {
      setError("Toolkit name is required.");
      return;
    }
    if (!useCase.trim()) {
      setError("Use case is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/app-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolkitName: toolkitName.trim(),
          useCase: useCase.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
      void fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (requestId: number) => {
    setVotingId(requestId);
    try {
      const res = await fetch(`/api/app-requests/${requestId}/upvote`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      const result = (await res.json()) as { votes: number; userVoted: boolean };

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, votes: result.votes, userVoted: result.userVoted }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setVotingId(null);
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-violet-500",
      "bg-cyan-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form card — full width like the API key card on home */}
      <Card>
        <CardContent className="pt-6">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
              <h3 className="mb-1 text-base font-semibold">Request Submitted!</h3>
              <p className="mb-5 text-sm text-muted-foreground">
                Your toolkit request has been added to the list.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setToolkitName("");
                  setUseCase("");
                }}
              >
                Submit Another
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-base font-medium text-foreground">
                    Request a New Toolkit
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check existing apps and pending requests first to avoid duplicates. Share the API docs or website link below.
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="text-xs">
                  To report an issue, use the{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/feedback")}
                    className="font-medium underline underline-offset-2 hover:no-underline"
                  >
                    Feedback
                  </button>{" "}
                  page instead.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="toolkitName">Toolkit Name</Label>
                  <Input
                    id="toolkitName"
                    placeholder="e.g. Smallest AI"
                    value={toolkitName}
                    onChange={(e) => setToolkitName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="useCase">Use-case, Tools, and API docs</Label>
                  <Input
                    id="useCase"
                    placeholder="Describe your use-case and paste any API docs link..."
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error ? (
                  <p className="text-sm text-destructive sm:col-span-3">{error}</p>
                ) : null}

                <div className="sm:col-span-3">
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Adding..." : "Add Request"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requests list — full width below */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Sparkles className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">No requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to request a new toolkit!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/30"
              >
                <button
                  type="button"
                  onClick={() => handleUpvote(req.id)}
                  disabled={votingId === req.id}
                  className={`flex shrink-0 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-2 text-sm font-semibold transition-colors ${
                    req.userVoted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {votingId === req.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ArrowUp className="h-3.5 w-3.5" />
                  )}
                  <span>{req.votes}</span>
                </button>

                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {req.toolkit_name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {req.use_case}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(req.user_id)}`}
                    >
                      {getInitials(req.email)}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {req.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
