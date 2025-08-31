"use client";

import { useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface RegenerateButtonProps {
  query: string;
}

export function RegenerateButton({ query }: RegenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate search");
      }

      const data = await response.json();

      // Navigate to the search results page with the new search term
      if (data.searchTerm) {
        router.push(`/watch?q=${encodeURIComponent(data.searchTerm)}`);
      }
    } catch (error) {
      console.error("Error regenerating search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegenerate}
      disabled={isLoading}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
    >
      <IconRefresh
        className={`h-5 w-5 mr-2 ${isLoading ? "animate-spin" : ""}`}
      />
      {isLoading ? "Regenerating..." : "Regenerate"}
    </button>
  );
}
