import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Trip Planner · WanderCraft" },
      { name: "description", content: "Day-by-day itineraries with real hotels, food, and honest ₹ budgets." },
    ],
  }),
  component: PlannerComingSoon,
});

function PlannerComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Stage 2 — shipping next
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold text-foreground md:text-5xl">
          The full planner is on its way.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Day-by-day itineraries, real hotels & restaurants, and an honest ₹ budget breakdown —
          ported directly from your existing WanderCraft data.
        </p>
        <p className="mt-2 text-muted-foreground">
          In the meantime, <strong className="text-foreground">WanderBot can plan any trip</strong> for you in chat.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 shadow-coral">
          <Link to="/chat">
            <MessageCircle className="mr-2 h-4 w-4" /> Plan with WanderBot
          </Link>
        </Button>
      </section>
    </div>
  );
}
