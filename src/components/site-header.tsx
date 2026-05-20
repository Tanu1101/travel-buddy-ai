import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Compass, LogOut } from "lucide-react";

export function SiteHeader() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-coral">
            <Compass className="h-4 w-4" />
          </span>
          WanderCraft
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/planner" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Planner
          </Link>
          <Link to="/destinations" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Destinations
          </Link>
          <Link to="/chat" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            AI Chat
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="shadow-coral">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
