"use client";

import { useState, useRef, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  MessageSquareText,
  ImagePlus,
  X,
  Loader2,
  Send,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeedbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(
    user?.emailAddresses?.[0]?.emailAddress || ""
  );
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please describe your issue or feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          image,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto pt-8">
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col items-center pt-12 pb-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Feedback Sent!</h2>
            <p className="text-muted-foreground mb-6">
              Thanks for reaching out. We will look into it and get back to you
              if needed.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto pt-4">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Send Feedback
            </CardTitle>
          </div>
          <CardDescription>
            Found a bug? Have a feature idea? Let us know and we will fix it or
            build it.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                What is the issue or suggestion?
              </Label>
              <Textarea
                id="message"
                placeholder="Describe what happened, what you expected, and steps to reproduce..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshot (optional)</Label>
              {image ? (
                <div className="relative inline-block">
                  <img
                    src={image}
                    alt="Selected"
                    className="h-32 w-auto rounded-xl border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-transparent transition-colors hover:bg-accent"
                >
                  <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload a screenshot
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
