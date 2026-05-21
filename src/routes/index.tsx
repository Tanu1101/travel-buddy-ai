import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  MapPinned,
  UtensilsCrossed,
  Hotel,
  MessageCircle,
  Wallet,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripZa — Plan smarter trips with an AI travel assistant" },
      {
        name: "description",
        content:
          "Day-by-day itineraries, real hotels and restaurants, honest budgets in ₹, and a TripBot chat assistant — built for Indian travelers.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered · Real prices in ₹ · Live chat
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-balance text-foreground md:text-7xl">
            Craft the trip{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              you&apos;ve been dreaming
            </span>{" "}
            of.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
            Day-by-day itineraries, honest budgets, and a travel assistant that
            actually knows Goa from Gokarna. Plan in minutes, not weekends.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base shadow-coral">
              <Link to="/chat">
                <MessageCircle className="mr-2 h-4 w-4" /> Talk to TripBot
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7 text-base">
              <Link to="/planner">
                Open the planner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute -inset-x-10 -top-10 h-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <PreviewStat label="Destinations" value="40+" sub="across India & abroad" />
              <PreviewStat label="Avg. plan time" value="< 2 min" sub="vs. hours of research" />
              <PreviewStat label="Budget accuracy" value="₹ honest" sub="real hotels, real food" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Everything you need to plan, in one warm place.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<MapPinned className="h-5 w-5" />}
            title="Day-by-day itineraries"
            text="Real activities with timing, costs, and the in-the-know order to do them in."
          />
          <Feature
            icon={<Hotel className="h-5 w-5" />}
            title="Real hotels & stays"
            text="Hostels to villas with realistic ₹ pricing. Filter by your travel style."
          />
          <Feature
            icon={<UtensilsCrossed className="h-5 w-5" />}
            title="Where the locals eat"
            text="Cuisine-tagged picks from street thalis to fine dining."
          />
          <Feature
            icon={<Wallet className="h-5 w-5" />}
            title="Honest budget split"
            text="Transport, stay, food, activities — see where every rupee goes."
          />
          <Feature
            icon={<MessageCircle className="h-5 w-5" />}
            title="TripBot AI chat"
            text="Streaming answers with markdown, history saved across devices."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Built for Indian travelers"
            text="Visa hints, season tips, flights from Mumbai, Delhi, Bangalore & more."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-28">
        <div className="rounded-3xl bg-foreground p-10 text-center text-background md:p-14">
          <h3 className="font-display text-3xl font-bold md:text-4xl">
            Where are you dreaming of going?
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-base opacity-80">
            Sign up free, save your chats, and start crafting trips in seconds.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-full bg-primary px-8 text-base shadow-coral">
            <Link to="/signup">Create a free account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TripZa. Plan boldly.
      </footer>
    </div>
  );
}

function PreviewStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
