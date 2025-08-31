"use client";

import Image from "next/image";
import Link from "next/link";

import LikeDislikeButtons from "./LikeDislikeButtons";

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

export default function VideoCard({ item }: { item: YoutubeSearchResult }) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <Link
        href={`/watch/${item.id.videoId}`}
        className="relative w-full pt-[56.25%] block"
      >
        <Image
          src={item.snippet.thumbnails.high.url}
          alt={item.snippet.title}
          fill
          className="object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/watch/${item.id.videoId}`} className="block">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 hover:text-blue-500 transition-colors">
            {item.snippet.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">
          {item.snippet.description}
        </p>
        <div className="mt-auto">
          <div className="flex items-center mb-3">
            <p className="text-xs text-gray-400">
              {new Date(item.snippet.publishTime).toLocaleDateString()}
            </p>
            <p className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-300">
              {item.snippet.channelTitle}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <LikeDislikeButtons
              videoId={item.id.videoId}
              videoTitle={item.snippet.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
