import { db } from "../../../../../db/client";
import { enquiries } from "../../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all enquiries, ordered by most recent first
    const allEnquiries = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt));

    return NextResponse.json(allEnquiries);
  } catch (error) {
    console.error("Failed to fetch enquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      id?: string;
      status?: string;
    };
    
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(enquiries)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update enquiry:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}
