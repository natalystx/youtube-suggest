"use client";

import { useState } from "react";
import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";

type LikeDislikeButtonsProps = {
  videoId: string;
  videoTitle: string;
};

export default function LikeDislikeButtons({
  videoId,
  videoTitle,
}: LikeDislikeButtonsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendAction = async (action: "like" | "dislike") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/video-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          videoId,
          videoTitle,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record action");
      }

      // Action successfully recorded
    } catch (error) {
      console.error("Error sending video action:", error);

      // Revert state on error
      if (action === "like") {
        setLiked(!liked);
        if (!liked && disliked) setDisliked(false);
      } else {
        setDisliked(!disliked);
        if (!disliked && liked) setLiked(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLikedState = !liked;
    setLiked(newLikedState);
    if (disliked) setDisliked(false);

    // Only send action if we're liking
    if (newLikedState) {
      sendAction("like");
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newDislikedState = !disliked;
    setDisliked(newDislikedState);
    if (liked) setLiked(false);

    // Only send action if we're disliking
    if (newDislikedState) {
      sendAction("dislike");
    }
  };

  return (
    <div className="flex gap-4 mt-3" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
          liked
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <IconThumbUp
          size={16}
          className={
            liked
              ? "text-blue-600 dark:text-blue-300"
              : "text-gray-500 dark:text-gray-400"
          }
        />
        Like
      </button>
      <button
        onClick={handleDislike}
        disabled={isLoading}
        className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
          disliked
            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <IconThumbDown
          size={16}
          className={
            disliked
              ? "text-red-600 dark:text-red-300"
              : "text-gray-500 dark:text-gray-400"
          }
        />
        Dislike
      </button>
    </div>
  );
}
