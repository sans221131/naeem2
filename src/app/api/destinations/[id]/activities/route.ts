import { db } from "../../../../../../db/client";
import { activities } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const destinationActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.destinationId, id))
      .orderBy(activities.reviewCount);

    return NextResponse.json(destinationActivities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
