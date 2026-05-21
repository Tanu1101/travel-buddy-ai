import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { findDestination, type Destination } from "@/lib/destinations-data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Wallet,
  Hotel,
  UtensilsCrossed,
  Camera,
  MessageCircle,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const dest = findDestination(params.slug);
    if (!dest) throw notFound();
    return { dest };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.dest;
    if (!d) return { meta: [{ title: "Destination · TripZa" }] };
    return {
      meta: [
        { title: `${d.name} Travel Guide · TripZa` },
        {
          name: "description",
          content: `${d.name}: ${d.tagline} Best time ${d.bestTime}. Budget ${d.budgetPerDay}/day.`,
        },
        { property: "og:title", content: `${d.name} Travel Guide · TripZa` },
        { property: "og:description", content: d.tagline },
        { property: "og:image", content: d.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-gradient-hero p-8 text-center">
      <div>
        <p className="font-display text-4xl font-bold">Destination not found</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/destinations">Browse all destinations</Link>
        </Button>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center bg-gradient-hero p-8 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: DestinationDetail,
});

function DestinationDetail() {
  const { dest: d } = Route.useLoaderData() as { dest: Destination };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
        <img src={d.image} alt={`${d.name}, ${d.region}`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-10 text-white">
          <Link
            to="/destinations"
            className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All destinations
          </Link>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-90">
            <MapPin className="h-3.5 w-3.5" /> {d.region} · {d.country}
          </div>
          <h1 className="mt-2 font-display text-5xl font-bold md:text-7xl">{d.name}</h1>
          <p className="mt-3 max-w-xl text-lg opacity-90">{d.tagline}</p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto -mt-10 max-w-6xl px-5">
        <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-3">
          <Fact icon={<Calendar className="h-4 w-4" />} label="Best time" value={d.bestTime} />
          <Fact icon={<Wallet className="h-4 w-4" />} label="Daily budget" value={d.budgetPerDay} />
          <Fact
            icon={<Camera className="h-4 w-4" />}
            label="Vibe"
            value={d.vibe.join(" · ")}
          />
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
        <Block icon={<Hotel className="h-4 w-4" />} title="Where to stay">
          {d.hotels.map((h) => (
            <Row key={h.name} title={h.name} sub={h.vibe} right={h.price} />
          ))}
        </Block>
        <Block icon={<UtensilsCrossed className="h-4 w-4" />} title="Where to eat">
          {d.restaurants.map((r) => (
            <Row key={r.name} title={r.name} sub={r.cuisine} right={r.price} />
          ))}
        </Block>
        <Block icon={<Camera className="h-4 w-4" />} title="What to see">
          {d.sights.map((s) => (
            <Row key={s.name} title={s.name} sub={s.note} />
          ))}
        </Block>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="rounded-3xl bg-foreground p-10 text-center text-background md:p-12">
          <h3 className="font-display text-3xl font-bold md:text-4xl">
            Ready to plan {d.name}?
          </h3>
          <p className="mx-auto mt-3 max-w-md opacity-80">
            Let TripBot build a day-by-day itinerary from your dates and budget.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-primary px-7 shadow-coral">
              <Link to="/planner" search={{ destination: d.name }}>
                Plan a trip
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-background/30 bg-transparent px-7 text-background hover:bg-background hover:text-foreground"
            >
              <Link to="/chat">
                <MessageCircle className="mr-2 h-4 w-4" /> Ask TripBot
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/15 text-secondary">{icon}</span>
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function Row({ title, sub, right }: { title: string; sub: string; right?: string }) {
  return (
    <li className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">{sub}</div>
        </div>
        {right ? <div className="shrink-0 text-sm font-medium text-primary">{right}</div> : null}
      </div>
    </li>
  );
}
