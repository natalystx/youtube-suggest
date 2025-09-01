"use client";

import { useState, useEffect, useRef } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type VideoSummaryChatProps = {
  videoId: string;
  videoTitle: string;
};

export default function VideoSummaryChat({
  videoId,
  videoTitle,
}: VideoSummaryChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaryLoaded, setSummaryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    const scrollHeight = messagesEndRef.current?.scrollHeight;
    messagesEndRef.current?.scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  // Load initial summary when component mounts
  useEffect(() => {
    const fetchSummary = async () => {
      if (!summaryLoaded) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/chat/summary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ videoId, videoTitle }),
          });

          if (!response.ok) {
            throw new Error("Failed to get video summary");
          }

          const data = await response.json();

          setMessages([
            {
              role: "assistant",
              content: data.summary,
            },
          ]);
          setSummaryLoaded(true);
        } catch (error) {
          console.error("Error getting video summary:", error);
          setMessages([
            {
              role: "assistant",
              content:
                "Sorry, I couldn't generate a summary for this video. Feel free to ask questions about it though!",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSummary();
  }, [videoId, videoTitle, summaryLoaded]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Show loading state
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          videoTitle,
          message: userMessage,
          conversation: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error in chat conversation:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateSummary = async () => {
    setSummaryLoaded(false);
    setMessages([]);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-black">
          Video Chat & Summary
        </h3>
        <button
          onClick={regenerateSummary}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          disabled={isLoading}
          title="Regenerate summary"
        >
          <IconRefresh className="w-5 h-5" />
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
        {messages.length === 0 && isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.role === "assistant"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                  : "bg-gray-100 dark:bg-gray-700"
              } p-3 rounded-lg`}
            >
              <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {msg.role === "assistant" ? "AI Summary & Chat" : "You"}
              </p>
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-sm">
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && messages.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              AI Summary & Chat
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              scrollToBottom();
            }}
            placeholder="Ask about this video..."
            className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
