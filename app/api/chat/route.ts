import { searchSuggest } from "~/ai/search";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get search suggestions from AI
    const suggestions = await searchSuggest(message);

    // Get the most relevant search term
    const mostRelevant = suggestions.searchTerms.sort(
      (a, b) => b.matchScore - a.matchScore
    )[0];

    return NextResponse.json({
      searchTerm: mostRelevant.term,
      sentiment: suggestions.sentiment,
      context: suggestions.context,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
