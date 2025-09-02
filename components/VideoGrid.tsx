"use client";

import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";

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

type VideoGridProps = {
  title?: string;
  category?: string;
  titleFromCategory?: boolean;
};

export default function VideoGrid({
  title = "Suggested Videos",
  category,
  titleFromCategory = false,
}: VideoGridProps) {
  const [videos, setVideos] = useState<YoutubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayTitle, setDisplayTitle] = useState(title);

  useEffect(() => {
    console.log("cat", category);
    console.log("titleFromCategory", titleFromCategory);
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const endpoint = category
          ? `/api/video-action?category=${encodeURIComponent(category)}`
          : "/api/video-action";

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        setVideos(data.videos || []);

        // Set title based on category if requested
        if (titleFromCategory && category) {
          setDisplayTitle(
            `${category.charAt(0).toUpperCase() + category.slice(1)} Videos`
          );
        }
      } catch (err) {
        console.error("Error fetching suggested videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [category, titleFromCategory]);

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">{displayTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">{displayTitle}</h2>
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">{displayTitle}</h2>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-blue-700 dark:text-blue-300">
          No videos found. Try asking for recommendations or liking some videos
          to improve suggestions.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">{displayTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((item) => (
          <VideoCard key={item.id.videoId} item={item} />
        ))}
      </div>
    </div>
  );
}
