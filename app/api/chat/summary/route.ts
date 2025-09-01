import { NextResponse } from "next/server";
import { youtubeClient } from "~/collabs/youtube";
import { llmChat } from "~/collabs/llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createChromaVectorStore } from "~/collabs/chroma";

// Helper function to fetch video details
async function getVideoDetails(videoId: string) {
  try {
    const response = await youtubeClient.videos.list({
      id: [videoId],
      part: ["snippet", "statistics"],
    });
    return response.data.items?.[0];
  } catch (error) {
    console.error("Error fetching video details for summary:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { videoId, videoTitle } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const { vectorStore } = await createChromaVectorStore();

    const histories = await vectorStore.similaritySearchWithScore(videoTitle);

    // Get more details about the video
    const videoDetails = await getVideoDetails(videoId);
    const description = videoDetails?.snippet?.description || "";
    const channelTitle = videoDetails?.snippet?.channelTitle || "";
    const title = videoDetails?.snippet?.title || videoTitle;

    // Generate video URL
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Generate summary with LLM
    const summary = await llmChat.invoke([
      new SystemMessage(
        `You are an assistant that summarizes YouTube videos based on their title and description. 
         Provide a concise but informative summary of the video. 
         Include key points that might be covered in the video based on the description.
         Format your response in a friendly, conversational way.
         Start with a brief introduction like "This video is about..." and then provide the summary.
         End with an invitation for the user to ask questions about the video topic.
         1. Read the title and description
         2. Watch the video via Video URL
         3. Summarize all video's contents.
         4. Provide a conclusion and invite questions.
         5. Provide additional topic for research based-on last videos preferences.
         `
      ),
      new HumanMessage(
        `  Last videos preferences:
         ${histories
           .map(
             ([item]) =>
               `- Video Title: ${item.pageContent}, action: ${item.metadata.action}`
           )
           .join("\n")}
        
        Video Title: ${title}
         Channel: ${channelTitle}
         Video URL: ${videoUrl}
         Description: ${description}
         
         Please provide a summary of this video.`
      ),
    ]);

    return NextResponse.json({
      summary: summary.content,
    });
  } catch (error) {
    console.error("Error generating video summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
