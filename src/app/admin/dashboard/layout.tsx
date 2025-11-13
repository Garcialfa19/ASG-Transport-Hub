import { AuthGuard } from "@/components/shared/AuthGuard";

export const runtime = 'nodejs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrapping the dashboard in the AuthGuard keeps the routing declarative.
  return <AuthGuard>{children}</AuthGuard>;
}
