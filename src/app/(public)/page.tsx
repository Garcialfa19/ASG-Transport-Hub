import { RoutesSection } from "@/components/public/RoutesSection";

export default function HomePage() {
  // The home page stays extremely small: a server component fetches routes and passes them
  // to the client-side gallery. Keeping the data fetch here makes the route cache-friendly
  // while the UI remains interactive.
  return <RoutesSection />;
}
