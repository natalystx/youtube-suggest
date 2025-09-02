/* eslint-disable @typescript-eslint/no-explicit-any */
import { llmChat } from "~/collabs/llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import { z } from "zod";
import { createChromaVectorStore } from "~/collabs/chroma";
import { embeddings } from "~/collabs/embeddings";
import { v7 as uuid } from "uuid";

const systemPrompt = (
  preferedCategories: string[],
  lastSearchedTerm?: string[]
) =>
  new SystemMessage(
    `You are the personal assistant for YouTube Video suggestions.
    You need to suggest the best videos search terms based on user input.
    1. Analyze the user's query and then provide a list of relevant search terms.
    2. Sentiment analysis: Determine the sentiment of the user's query intention which mode like learning, entertainment, etc.
    3. Contextual understanding: Align the original user's search term and your suggested search terms.
    4. Output: Provide the final search terms with most relevance to the user's query.

    User's preferred video categories: ${preferedCategories.join(", ")}
    Last searched term for this topic: ${lastSearchedTerm?.join(", ") ?? ""}
    `
  );

const createDocument = (
  pageContent: string,
  metadata: Record<string, any>
): Document => {
  return new Document({
    pageContent,
    id: uuid(),
    metadata: { ...metadata, createdAt: new Date().toISOString() },
  });
};

const suggestSchema = z.object({
  term: z.string().min(2).max(100).describe("The suggested search term"),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("The relevance score of the term"),
});

const searchSuggestOutputSchema = z.object({
  searchTerms: z
    .array(suggestSchema)
    .min(1)
    .max(5)
    .describe("The list of suggested search terms"),
  sentiment: z
    .string()
    .min(2)
    .max(100)
    .describe("The sentiment of the user's query"),
  context: z
    .string()
    .min(2)
    .max(100)
    .describe("The context of the user's query"),
});

const categorySchema = z.object({
  name: z.string().min(2).max(100),
});

const categoriesSchema = z.array(categorySchema);

const determineCategory = async (searchTerms: string[]): Promise<string[]> => {
  const result = await llmChat.withStructuredOutput(categoriesSchema).invoke([
    new SystemMessage(
      `You are an expert in categorizing YouTube videos into predefined categories. 
      The categories are: Music, Education, Entertainment, Sports, News, Technology, Lifestyle, Comedy, Gaming, Travel.
      Analyze the following search terms and determine the most appropriate category that best fits the overall theme of these terms.`
    ),
    new HumanMessage(
      `Search Terms: ${searchTerms.join(
        ", "
      )}\n\nProvide only the category name as the output.`
    ),
  ]);

  return result.map((category) => category.name);
};

const searchSuggest = async (userInput: string) => {
  // Use the async version of createChromaVectorStore
  const { vectorStore } = await createChromaVectorStore();
  const embedded = await embeddings.embedQuery(userInput);

  try {
    const vectorSearchResult =
      await vectorStore.similaritySearchVectorWithScore(embedded, 5, {
        action: "like",
      });

    const recentSearchTerms =
      vectorSearchResult?.map(([doc]) => doc.pageContent) || [];

    const recentCategories = recentSearchTerms?.length
      ? await determineCategory(recentSearchTerms)
      : [];

    const result = await llmChat
      .withStructuredOutput(searchSuggestOutputSchema)
      .invoke([
        systemPrompt(recentCategories, recentSearchTerms),
        new HumanMessage(userInput),
      ]);
    return result;
  } catch (error) {
    console.error("Error in searchSuggest:", error);
    // Fall back to basic search without vector results
    const result = await llmChat
      .withStructuredOutput(searchSuggestOutputSchema)
      .invoke([systemPrompt([], []), new HumanMessage(userInput)]);
    return result;
  }
};

const addAction: (
  action: "like" | "dislike",
  videoName: string,
  videoId: string
) => Promise<boolean> = async (action, videoName, videoId) => {
  try {
    // Create the document with metadata
    const document = createDocument(videoName, { action, videoId });

    // Use the async version of createChromaVectorStore
    const { vectorStore } = await createChromaVectorStore();

    // Add the document - this will automatically embed it
    await vectorStore.addDocuments([document], { ids: [document.id!] });

    return true;
  } catch (error) {
    console.error("Error adding action to vector store:", error);
    return false;
  }
};

export type YoutubeSearchResult = {
  title: string;
  description: string;
  videoId: string;
};

const bestMatchSystemMessage = (likesVideoTitles: string[]) =>
  new SystemMessage(
    `You're the assistant responsible for finding the best match videos for a user's query and preferences.
  Your task is to analyze the search results and return the top videos that best match the user's intent.
  The user's liked video titles are: ${likesVideoTitles.join(", ")}
  `
  );

const bestMatchResultSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    videoId: z.string(),
  })
);

const bestMatchResultMessage = (results: YoutubeSearchResult[]) =>
  new HumanMessage(
    `Here are the top 3 videos that best match your preferences:\n\n` +
      results
        .map(
          (video, index) =>
            `${index + 1}. title:${video.title} (ID: ${
              video.videoId
            }) description:${video.description}`
        )
        .join("\n")
  );

const bestMatchVideos = async (
  searchResults: YoutubeSearchResult[]
): Promise<YoutubeSearchResult[]> => {
  const { vectorStore } = await createChromaVectorStore();
  const embedded = await embeddings.embedQuery(
    searchResults.map((i) => i.title).join(",")
  );
  const vectorSearchResult = await vectorStore.similaritySearchVectorWithScore(
    embedded,
    10
  );
  const results = await llmChat
    .withStructuredOutput(bestMatchResultSchema)
    .invoke([
      bestMatchSystemMessage(vectorSearchResult.map(([i]) => i.pageContent)),
      bestMatchResultMessage(searchResults),
    ]);

  return results as YoutubeSearchResult[];
};

/**
 * Get recommended categories based on user preferences
 * Returns a list of categories that might interest the user
 */
const getRecommendedCategories = async (): Promise<string> => {
  try {
    // Get vector store to access user preferences
    const { vectorStore } = await createChromaVectorStore();

    // Fetch user's liked content
    const likedContent = await vectorStore.similaritySearch("", 20);

    // If we have enough liked content, determine categories
    if (likedContent && likedContent.length > 0) {
      // Extract content titles
      const contentTitles = likedContent.map((doc) => doc.pageContent);

      const cates = await determineCategory(contentTitles);

      // const suggestTerm = await searchSuggest(contentTitles.join(", "));
      const result = await llmChat
        .withStructuredOutput(searchSuggestOutputSchema)
        .invoke([
          systemPrompt(
            cates,
            contentTitles.map((content) => content)
          ),
          new HumanMessage(contentTitles.join(", ")),
        ]);

      // Return unique categories
      return result.searchTerms.sort((a, b) => b.matchScore - a.matchScore)[0]
        .term;
    }

    // Default categories if no preferences are found
    return "";
  } catch (error) {
    console.error("Error getting recommended categories:", error);
    return "";
  }
};

export { searchSuggest, addAction, bestMatchVideos, getRecommendedCategories };
