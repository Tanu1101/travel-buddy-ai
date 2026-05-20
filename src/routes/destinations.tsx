import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { DESTINATIONS } from "@/lib/destinations-data";
import { MapPin, Calendar, Wallet, ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations · WanderCraft" },
      {
        name: "description",
        content:
          "Curated destinations across India and beyond — Goa, Manali, Jaipur, Kerala, Bali, Ladakh and more, with hotels, restaurants and ₹ budgets.",
      },
      { property: "og:title", content: "Destinations · WanderCraft" },
      {
        property: "og:description",
        content: "Hand-picked travel spots with real hotels, food, and ₹ pricing.",
      },
    ],
  }),
  component: DestinationsPage,
});

const FILTERS = ["All", "India", "International", "Beach", "Mountains", "Heritage"] as const;
type Filter = (typeof FILTERS)[number];

function DestinationsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      if (filter !== "All") {
        if (filter === "India" || filter === "International") {
          if (d.country !== filter) return false;
        } else if (!d.vibe.includes(filter)) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.region.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-6xl">
            Find your next <span className="text-primary">somewhere</span>.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Hand-picked spots with real hotels, real food, and honest ₹ budgets.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Goa, Bali…"
              className="h-11 rounded-full bg-card pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground shadow-coral"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        {items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No destinations match — try a different filter.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <Link
                key={d.slug}
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-coral"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name}, ${d.region}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="flex items-center gap-1 text-xs uppercase tracking-wider opacity-90">
                      <MapPin className="h-3 w-3" /> {d.region}
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-bold">{d.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-foreground/80 line-clamp-2">{d.tagline}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {d.bestTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5" /> {d.budgetPerDay}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
