import { db } from "../../../../db/client";
import { enquiries } from "../../../../db/schema";
import { NextRequest, NextResponse } from "next/server";

const SITE_NAME = "naveefintech";
const SITE_ID = "naveefintech";

export async function POST(request: NextRequest) {
  try {
    interface CartItemPayload {
      type: "activity" | "destination";
      id: string;
      destinationId?: string;
      destinationName?: string;
      name: string;
      price?: number;
      currency?: string;
    }

    const body = await request.json() as {
      name?: string;
      email?: string;
      phoneCountryCode?: string;
      phoneNumber?: string;
      message?: string;
      cartItems?: CartItemPayload[];
      sourcePage?: string;
    };
    
    const { name, email, phoneCountryCode, phoneNumber, message, cartItems, sourcePage } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Extract destination and activity info from cart items if present
    let destinationId: string | null = null;
    let activityId: string | null = null;
    let enrichedMessage = message || "";

    if (cartItems && cartItems.length > 0) {
      // Add cart items to message
      enrichedMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      enrichedMessage += `📋 SELECTED ITEMS FROM ${SITE_NAME.toUpperCase()}\n`;
      enrichedMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      const activities = cartItems.filter((item) => item.type === "activity");
      const destinations = cartItems.filter((item) => item.type === "destination");
      
      if (activities.length > 0) {
        enrichedMessage += `🎯 ACTIVITIES (${activities.length}):\n`;
        activities.forEach((item, index: number) => {
          enrichedMessage += `\n${index + 1}. ${item.name}`;
          if (!activityId) activityId = item.id;
          if (item.destinationName) {
            enrichedMessage += `\n   📍 Location: ${item.destinationName}`;
            if (!destinationId) destinationId = item.destinationId || null;
          }
          if ((item.price || 0) > 0) {
            enrichedMessage += `\n   💰 Price: ${item.currency || ""} ${(item.price || 0).toFixed(2)}`;
          }
          enrichedMessage += `\n   🆔 ID: ${item.id}`;
        });
        enrichedMessage += `\n`;
      }
      
      if (destinations.length > 0) {
        enrichedMessage += `\n🌍 DESTINATIONS (${destinations.length}):\n`;
        destinations.forEach((item, index: number) => {
          enrichedMessage += `\n${index + 1}. ${item.name}`;
          if (!destinationId) destinationId = item.destinationId || null;
          if ((item.price || 0) > 0) {
            enrichedMessage += `\n   💰 Price: ${item.currency || ""} ${(item.price || 0).toFixed(2)}`;
          }
          enrichedMessage += `\n   🆔 ID: ${item.id}`;
        });
        enrichedMessage += `\n`;
      }
      
      enrichedMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      enrichedMessage += `\n📊 SUMMARY:`;
      enrichedMessage += `\n   • Total Items: ${cartItems.length}`;
      enrichedMessage += `\n   • Activities: ${activities.length}`;
      enrichedMessage += `\n   • Destinations: ${destinations.length}`;
      
      const totalPrice = cartItems.reduce((sum: number, item) => sum + (item.price || 0), 0);
      if (totalPrice > 0) {
        const currencies = [...new Set(cartItems.map((item) => item.currency))];
        enrichedMessage += `\n   • Estimated Total: `;
        if (currencies.length === 1) {
          enrichedMessage += `${currencies[0]} ${totalPrice.toFixed(2)}`;
        } else {
          enrichedMessage += `Multiple currencies`;
        }
      }
      enrichedMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }

    // Add site information to message
    enrichedMessage += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    enrichedMessage += `\n🏢 ENQUIRY INFORMATION`;
    enrichedMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    enrichedMessage += `\n📱 Site: ${SITE_NAME}`;
    enrichedMessage += `\n📄 Source Page: ${sourcePage || "Unknown"}`;
    enrichedMessage += `\n📧 Customer Email: ${email}`;
    if (phoneNumber) {
      enrichedMessage += `\n📞 Customer Phone: ${phoneCountryCode || ""} ${phoneNumber}`;
    }
    enrichedMessage += `\n🕐 Submitted: ${new Date().toLocaleString("en-US", { 
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "long"
    })}`;
    enrichedMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    // Insert into database
    const [newEnquiry] = await db
      .insert(enquiries)
      .values({
        siteId: SITE_ID,
        sourcePage: sourcePage || "/cart",
        destinationId,
        activityId,
        name,
        email,
        phoneCountryCode: phoneCountryCode || null,
        phoneNumber: phoneNumber || null,
        message: enrichedMessage,
        status: "new",
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        enquiryId: newEnquiry.id,
        message: "Enquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
