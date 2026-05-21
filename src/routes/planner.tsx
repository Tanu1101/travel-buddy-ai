import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  Compass,
  Loader2,
  Copy,
  MessageCircle,
  Wand2,
} from "lucide-react";

const searchSchema = z.object({
  destination: z.string().optional(),
});

export const Route = createFileRoute("/planner")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Trip Planner · TripZa" },
      {
        name: "description",
        content:
          "Generate a day-by-day itinerary with real hotels, food, and a ₹ budget breakdown — powered by TripBot AI.",
      },
      { property: "og:title", content: "AI Trip Planner · TripZa" },
      {
        property: "og:description",
        content: "Tell TripBot where, when, and your budget — get a full plan in seconds.",
      },
    ],
  }),
  component: PlannerPage,
});

type Budget = "budget" | "mid" | "luxury";

function renderMd(text: string) {
  marked.setOptions({ breaks: true, gfm: true });
  return DOMPurify.sanitize(marked.parse(text) as string);
}

function PlannerPage() {
  const { user, loading: authLoading } = useAuth();
  const { destination: prefDestination } = Route.useSearch();

  const [destination, setDestination] = useState(prefDestination ?? "");
  const [origin, setOrigin] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState<Budget>("mid");
  const [interests, setInterests] = useState("");

  const [plan, setPlan] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim() || !origin.trim()) {
      toast.error("Please tell us where you're going from and to.");
      return;
    }
    setPlan("");
    setBusy(true);

    try {
      const { generatePlan } = await import("@/lib/plan.functions");
      const response = (await generatePlan({
        data: {
          destination: destination.trim(),
          origin: origin.trim(),
          days,
          travelers,
          budget,
          interests: interests.trim() || undefined,
        },
      })) as unknown as Response;

      if (!response.ok || !response.body) {
        const txt = await response.text().catch(() => "");
        throw new Error(txt || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assembled = "";
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const json = JSON.parse(payload);
            const chunk: string | undefined = json.choices?.[0]?.delta?.content;
            if (chunk) {
              assembled += chunk;
              setPlan(assembled);
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  // Auth gate (planner needs the protected server fn)
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <SiteHeader />
        <section className="mx-auto max-w-md px-5 py-24 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Sign in to start planning</h1>
          <p className="mt-3 text-muted-foreground">
            The AI planner is free — just create a quick account so we can save your trips.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="rounded-full shadow-coral">
              <Link to="/signup">Create account</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 pt-12 pb-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
            <Wand2 className="h-3.5 w-3.5 text-primary" /> AI Trip Planner
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-foreground md:text-6xl">
            Tell us the basics. We&apos;ll handle the plan.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Day-by-day itinerary, real hotels, food, transport, and a ₹ budget breakdown — in seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-24 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <form
          onSubmit={generate}
          className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="space-y-4">
            <Field label="From">
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Mumbai"
              />
            </Field>
            <Field label="Destination">
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Goa, Bali, Manali…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Days">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
                />
              </Field>
              <Field label="Travelers">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) =>
                    setTravelers(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
                  }
                />
              </Field>
            </div>
            <Field label="Budget">
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { v: "budget", label: "Budget", sub: "₹1.5–3k/day" },
                    { v: "mid", label: "Mid", sub: "₹3–6k/day" },
                    { v: "luxury", label: "Luxury", sub: "₹8k+/day" },
                  ] as { v: Budget; label: string; sub: string }[]
                ).map((b) => (
                  <button
                    key={b.v}
                    type="button"
                    onClick={() => setBudget(b.v)}
                    className={`rounded-xl border p-3 text-left text-xs transition-all ${
                      budget === b.v
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <div className="text-sm font-semibold">{b.label}</div>
                    <div className="text-muted-foreground">{b.sub}</div>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Interests (optional)">
              <Textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Beaches, scuba diving, no museums please…"
                className="min-h-[80px] resize-none"
              />
            </Field>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-6 h-12 w-full rounded-full text-base shadow-coral"
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Crafting your trip…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate itinerary
              </>
            )}
          </Button>
        </form>

        {/* Output */}
        <div className="min-h-[60vh] rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          {!plan && !busy ? (
            <EmptyState />
          ) : (
            <article>
              {plan && (
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Compass className="h-3.5 w-3.5 text-primary" />
                    {destination} · {days} day{days > 1 ? "s" : ""}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(plan);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              )}
              <div
                className="prose-chat text-[15px] text-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMd(plan || "_Generating…_"),
                }}
              />
              {busy && (
                <div className="mt-2 inline-flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> TripBot is writing…
                </div>
              )}
            </article>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center py-12 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold">Your itinerary will appear here</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Fill out the form and hit <strong>Generate</strong>. Want to brainstorm first?
        </p>
        <Button asChild variant="outline" className="mt-5 rounded-full">
          <Link to="/chat">
            <MessageCircle className="mr-2 h-4 w-4" /> Chat with TripBot
          </Link>
        </Button>
      </div>
    </div>
  );
}
