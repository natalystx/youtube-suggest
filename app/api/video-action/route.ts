import { NextResponse } from "next/server";
import { addAction } from "~/ai/search";

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
