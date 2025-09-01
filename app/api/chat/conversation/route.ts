import { NextResponse } from "next/server";
import { llmChat } from "~/collabs/llm";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { youtubeClient } from "~/collabs/youtube";

// Helper function to fetch video details
async function getVideoDetails(videoId: string) {
  try {
    const response = await youtubeClient.videos.list({
      id: [videoId],
      part: ["snippet", "statistics"],
    });
    return response.data.items?.[0];
  } catch (error) {
    console.error("Error fetching video details for conversation:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { videoId, videoTitle, message, conversation } = await request.json();

    if (!videoId || !message) {
      return NextResponse.json(
        { error: "Video ID and message are required" },
        { status: 400 }
      );
    }

    // Get more details about the video
    const videoDetails = await getVideoDetails(videoId);
    const description = videoDetails?.snippet?.description || "";
    const channelTitle = videoDetails?.snippet?.channelTitle || "";
    const title = videoDetails?.snippet?.title || videoTitle;
    const viewCount = videoDetails?.statistics?.viewCount || "unknown";
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Convert conversation history to LangChain message format
    const conversationHistory = conversation.map(
      (msg: { role: string; content: string }) => {
        if (msg.role === "assistant") {
          return new AIMessage(msg.content);
        } else {
          return new HumanMessage(msg.content);
        }
      }
    );

    // Generate response with LLM
    const response = await llmChat.invoke([
      new SystemMessage(
        `You are an assistant that helps users understand YouTube videos and discuss their content.
         You have information about a video titled "${title}" from the channel "${channelTitle}".
         
         Video URL: ${videoUrl}
         Video description: ${description}
         
         View count: ${viewCount}
         
         Answer the user's questions about the video topic in a helpful, informative way.
         If the question is not related to the video or its topic, you can still answer but mention that it's not directly related to the video content.
         Be conversational, friendly, and concise in your responses.
         If you don't know something specific about the video content that wasn't in the description, acknowledge that limitation politely.`
      ),
      ...conversationHistory,
      new HumanMessage(message),
    ]);

    return NextResponse.json({
      response: response.content,
    });
  } catch (error) {
    console.error("Error generating conversation response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
