import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations · WanderCraft" },
      { name: "description", content: "Browse curated destinations across India and beyond." },
    ],
  }),
  component: DestinationsComingSoon,
});

function DestinationsComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Stage 3 — coming soon
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold text-foreground md:text-5xl">
          Browse hand-picked destinations.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Goa, Manali, Rajasthan, Bali and more — with hotels, restaurants, and places to visit.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7 shadow-coral">
          <Link to="/chat">
            <MessageCircle className="mr-2 h-4 w-4" /> Ask WanderBot about anywhere
          </Link>
        </Button>
      </section>
    </div>
  );
}
