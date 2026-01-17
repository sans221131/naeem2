 import { db } from "../../db/client";
import { Activity, activities as activitiesTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import HeroBanner from "../components/HeroBanner";
import ClientOnly from "../components/ClientOnly";
import CountriesSection from "../components/CountriesSection";
import FAQSection from "../components/FAQSection";
import ReviewsSection from "@/components/review";
import ContactButton from "@/components/ContactButton";

export default async function Home() {
  // Fetch ALL active activities using Drizzle's query builder
  let rawActivities: Record<string, unknown>[] = [];
  try {
    const rows = await db.select().from(activitiesTable).where(eq(activitiesTable.isActive, true));
    rawActivities = (rows ?? []) as unknown as Record<string, unknown>[];
  } catch (err) {
    // Log detailed error for debugging and show a graceful fallback on the page
    console.error("Failed query: select from activities where is_active = true");
    console.error("Error details:", err instanceof Error ? err.message : String(err));
    console.error("This usually means the database tables haven't been created yet.");
    console.error("Run database migrations or create the activities table first.");
    rawActivities = [];
  }

  // Use a view type where dates are serialized as strings (safer across server/client)
  type ActivityView = Omit<Activity, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };

  // Map snake_case database fields to camelCase for components
  const randomActivities: ActivityView[] = rawActivities.map((activity) => ({
    id: String(activity["id"] ?? ""),
    destinationId: String(activity["destination_id"] ?? activity["destinationId"] ?? ""),
    name: String(activity["name"] ?? ""),
    description: String(activity["description"] ?? ""),
    // Drizzle/pg-core maps numeric to string in select types, keep string here
    price: String(activity["price"] ?? "0"),
    currency: String(activity["currency"] ?? ""),
    reviewCount: Number(activity["review_count"] ?? activity["reviewCount"] ?? 0),
    imageUrl: String(activity["image_url"] ?? activity["imageUrl"] ?? ""),
    isActive: Boolean(activity["is_active"] ?? activity["isActive"] ?? true),
    createdAt: String(activity["created_at"] ?? activity["createdAt"] ?? ""),
    updatedAt: String(activity["updated_at"] ?? activity["updatedAt"] ?? ""),
  }));

  // Helper: detect bullet-like lines in description.
  // We consider lines starting with -, • or * followed by space as bullets.
  function hasBullets(desc?: string) {
    if (!desc) return false;
    return /(^|\n)\s*[-•*]\s+/m.test(desc);
  }

  // Keep only activities that include bullet points in their description.
  const withBullets = randomActivities.filter((a) => hasBullets(a.description));

  // Deterministic selection for hero: sort by reviewCount desc, then newest
  const heroActivities = [...withBullets]
    .sort((a, b) => {
      const revDiff = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      if (revDiff !== 0) return revDiff;
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  return (
    <main className="min-h-screen">
      <div suppressHydrationWarning>
        {heroActivities.length > 0 ? (
          <ClientOnly>
            <HeroBanner activities={heroActivities as unknown as Activity[]} />
          </ClientOnly>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-center text-gray-600">No featured activities available at the moment.</p>
          </div>
        )}
      </div>
      <div suppressHydrationWarning>
        <ClientOnly>
          <CountriesSection activities={randomActivities as unknown as Activity[]} />
        </ClientOnly>
      </div>
      <div suppressHydrationWarning>
        <ClientOnly>
          <ReviewsSection />
        </ClientOnly>
      </div>
      <div suppressHydrationWarning>
        <ClientOnly>
          <FAQSection />
        </ClientOnly>
      </div>
      
      {/* Floating Contact Button */}
      <div suppressHydrationWarning>
        <ClientOnly>
          <ContactButton variant="floating" sourcePage="/" />
        </ClientOnly>
      </div>
    </main>
	);
}
