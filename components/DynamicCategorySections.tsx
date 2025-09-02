"use client";

import { useEffect, useState } from "react";
import VideoGrid from "./VideoGrid";

export default function DynamicCategorySections() {
  const [categories, setCategories] = useState<{ category: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        // Limit to 4 categories to avoid overwhelming the UI
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load category recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-16 mt-16">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="w-full">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  // Always show the recommended section
  return (
    <div className="space-y-16">
      {categories && (
        <VideoGrid
          key={categories.category}
          category={categories.category.toLowerCase()}
          titleFromCategory={true}
        />
      )}
    </div>
  );
}
