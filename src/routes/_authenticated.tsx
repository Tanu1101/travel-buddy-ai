import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated")({
  component: Gate,
});

function Gate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-hero">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}
