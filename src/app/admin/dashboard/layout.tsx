import { AuthGuard } from "@/components/shared/AuthGuard";

export const runtime = 'nodejs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
