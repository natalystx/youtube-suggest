import { NextRequest, NextResponse } from "next/server";
import { addAction, bestMatchVideos } from "~/ai/search";
import { youtubeClient } from "~/collabs/youtube";
import { createChromaVectorStore } from "~/collabs/chroma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    console.log("cat", category);

    if (category) {
      const videos = await youtubeClient.search.list({
        part: ["id", "snippet"],
        q: category,
        type: ["video"],
        maxResults: 20,
      });
      return NextResponse.json({
        videos: videos.data.items,
        searchTerm: category,
      });
    }

    // Get user preferences from the vector store
    const { vectorStore } = await createChromaVectorStore();
    // Extract categories from liked videos to determine preferences
    let searchTerms: string[] = [];
    if (!category) {
      // Find liked videos in the vector store
      const results = await vectorStore.similaritySearch("", 10, {
        action: "like",
      });

      // If we have liked videos, use them to build search terms
      if (results && results.length > 0) {
        searchTerms = results.map((doc) => doc.pageContent);
      }
    }
    // If a category is provided, use it as a filter
    if (category) {
      searchTerms.push(category);
    }

    // If no preferences are available, use some default categories
    if (searchTerms.length === 0) {
      searchTerms = ["trending videos", "popular videos", "recommended videos"];
    }

    // Get a random term to have variety in suggestions
    const randomIndex = Math.floor(Math.random() * searchTerms.length);
    const searchTerm = searchTerms[randomIndex];

    // Fetch videos based on the selected search term
    const videos = await youtubeClient.search.list({
      part: ["id", "snippet"],
      q: searchTerm,
      type: ["video"],
      maxResults: 20,
    });

    // Use AI to rank the videos based on preferences
    let rankedVideos = videos.data.items || [];

    // If we have past preferences, use them to rank videos
    if (!category) {
      const matchedVideos = await bestMatchVideos(
        rankedVideos.map((i) => ({
          title: i?.snippet?.title || "",
          description: i?.snippet?.description || "",
          videoId: i?.id?.videoId || "",
        })) || []
      );

      // Filter the videos to only include ranked ones
      rankedVideos = category
        ? rankedVideos
        : rankedVideos.filter((item) =>
            matchedVideos.some((m) => m.videoId === item.id?.videoId)
          );
    }

    return NextResponse.json({
      videos: rankedVideos,
      searchTerm,
    });
  } catch (error) {
    console.error("Error fetching suggested videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggested videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, videoId, videoTitle } = await request.json();

    // Validate inputs
    if (!action || !videoId || !videoTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action !== "like" && action !== "dislike") {
      return NextResponse.json(
        { error: "Action must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    // Add the action to the vector store
    const success = await addAction(action, videoTitle, videoId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to record action" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in video-action API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
