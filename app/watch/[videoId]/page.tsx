import Link from "next/link";
import { youtubeClient } from "~/collabs/youtube";
import { IconArrowLeft } from "@tabler/icons-react";
import LikeDislikeButtons from "~/components/LikeDislikeButtons";

// This enables server-side rendering for this page
export const dynamic = "force-dynamic";

// Fetch video details from YouTube API
async function getVideoDetails(videoId: string) {
  try {
    const response = await youtubeClient.videos.list({
      id: [videoId],
      part: ["snippet", "statistics"],
    });

    return response.data.items?.[0];
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

export default async function ViewVideoPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const videoDetails = await getVideoDetails(videoId);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* YouTube Video Embed */}
        <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={videoDetails?.snippet?.title || "YouTube Video"}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Details */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {videoDetails?.snippet?.title || "Video Title"}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 md:mb-0">
              {videoDetails?.snippet?.channelTitle || "Channel"} •
              {videoDetails?.snippet?.publishedAt && (
                <span>
                  {" "}
                  {new Date(
                    videoDetails.snippet.publishedAt
                  ).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <LikeDislikeButtons
                videoId={videoId}
                videoTitle={videoDetails?.snippet?.title || "Video Title"}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm">
              {videoDetails?.snippet?.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 mb-12">
          <Link
            href="/watch"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Link>
        </div>
      </div>
    </div>
  );
}
