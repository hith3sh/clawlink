"use client";

import { useState, useEffect, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowUp,
  Loader2,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

type SortMode = "trending" | "newest";

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
  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [votingId, setVotingId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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
  };

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
      fetchRequests();
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
    if (sortMode === "trending") {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: Request Form */}
      <div className="lg:col-span-1">
        <Card className="border border-border shadow-sm">
          <CardHeader className="space-y-4 pb-4">
            <CardTitle className="text-lg font-semibold">
              Request a New Toolkit
            </CardTitle>
            <CardDescription className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Check existing apps + pending requests first to avoid
                duplicates.
              </p>
              <p>
                Make sure to share the link to the API docs or website of the
                toolkit you want to request below.
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs">
                  If you want to report an issue, use the{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/feedback")}
                    className="underline hover:no-underline"
                  >
                    Feedback
                  </button>{" "}
                  page instead.
                </p>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
                <h3 className="mb-1 text-base font-semibold">
                  Request Submitted!
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="useCase">
                    Use-case, Tools, and API docs
                  </Label>
                  <Textarea
                    id="useCase"
                    placeholder="Describe what you want to do with this toolkit and share any API documentation links..."
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    rows={5}
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
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Adding..." : "Add Request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Requests List */}
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortMode("trending")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortMode === "trending"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Trending
          </button>
          <button
            type="button"
            onClick={() => setSortMode("newest")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortMode === "newest"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Newest
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <Lightbulb className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <h3 className="text-base font-medium">No requests yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to request a new toolkit!
              </p>
            </div>
          ) : (
            sortedRequests.map((req) => (
              <div
                key={req.id}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent/40"
              >
                {/* Upvote */}
                <button
                  type="button"
                  onClick={() => handleUpvote(req.id)}
                  disabled={votingId === req.id}
                  className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-2.5 py-2 transition-colors ${
                    req.userVoted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">{req.votes}</span>
                </button>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {req.toolkit_name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {req.use_case}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(
                        req.user_id
                      )}`}
                    >
                      {getInitials(req.email)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {req.email}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Toolkit Requests
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
