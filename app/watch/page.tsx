import { youtubeClient } from "~/collabs/youtube";
import VideoCard from "~/components/VideoCard";
import Link from "next/link";
import { IconHome, IconMessageCircle } from "@tabler/icons-react";
import { RegenerateButton } from "~/components/RegenerateButton";
import { bestMatchVideos } from "~/ai/search";

type YoutubeSearchResult = {
  kind: "youtube#searchResult";
  etag: string;
  id: {
    kind: "youtube#video";
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

type Props = {
  searchParams: { q?: string };
};

export default async function WatchPage({ searchParams }: Props) {
  const query = searchParams.q || "";

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">No Search Query</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Please enter a search term or ask the AI for video suggestions.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <IconHome className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <IconMessageCircle className="h-5 w-5" />
            Ask AI
          </Link>
        </div>
      </div>
    );
  }

  const videos = await youtubeClient.search.list({
    part: ["id", "snippet"],
    q: query,
    type: ["video"],
    maxResults: 12,
  });

  const bestMatch = await bestMatchVideos(
    videos?.data?.items?.map((i) => ({
      title: i?.snippet?.title || "",
      description: i?.snippet?.description || "",
      videoId: i?.id?.videoId || "",
    })) || []
  );

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          Videos for: <span className="text-blue-600">{query}</span>
        </h1>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            <IconHome className="h-5 w-5 mr-2" />
            Home
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <IconMessageCircle className="h-5 w-5 mr-2" />
            New Search
          </Link>
          <RegenerateButton query={query} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.data.items
          ?.map((i) => i as YoutubeSearchResult)
          .filter((i) => bestMatch.some((b) => b.videoId === i.id.videoId))
          .map((item) => (
            <VideoCard key={item.id.videoId} item={item} />
          ))}
      </div>

      {!videos.data.items || videos.data.items.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No videos found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try a different search term or ask AI for suggestions.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <IconMessageCircle className="h-5 w-5" />
            Ask AI for Videos
          </Link>
        </div>
      ) : null}
    </div>
  );
}
