import { searchSuggest } from "~/ai/search";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get search suggestions from AI
    const suggestions = await searchSuggest(query);

    // Get the most relevant search term (different from original if possible)
    const sortedSuggestions = suggestions.searchTerms.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    // Try to get a different search term than the original query
    let selectedTerm = sortedSuggestions[0].term;

    // If we have more than one suggestion and the top one is too similar to the query,
    // use the second most relevant suggestion instead
    if (
      sortedSuggestions.length > 1 &&
      selectedTerm.toLowerCase() === query.toLowerCase()
    ) {
      selectedTerm = sortedSuggestions[1].term;
    }

    return NextResponse.json({
      searchTerm: selectedTerm,
      sentiment: suggestions.sentiment,
      context: suggestions.context,
    });
  } catch (error) {
    console.error("Error regenerating search:", error);
    return NextResponse.json(
      { error: "Failed to regenerate search" },
      { status: 500 }
    );
  }
}
