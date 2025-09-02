import { NextResponse } from "next/server";
import { getRecommendedCategories } from "~/ai/search";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get recommended categories based on user preferences
    const category = await getRecommendedCategories();

    return NextResponse.json({
      category,
    });
  } catch (error) {
    console.error("Error fetching recommended categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended categories" },
      { status: 500 }
    );
  }
}
