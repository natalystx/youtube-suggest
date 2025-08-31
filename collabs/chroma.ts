import { Chroma } from "@langchain/community/vectorstores/chroma";
import { env } from "~/env";
import { CloudClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: env.GEMINI_API_KEY,
});

const client = new CloudClient({
  tenant: env.CHROMA_TENANT,
  database: env.CHROMA_DATABASE,
  apiKey: env.CHROMA_API_KEY,
});

const COLLECTION_NAME = "videos-collection";

// Function to create and get the vector store
export const createChromaVectorStore = async () => {
  try {
    const vectorStore = new Chroma(embeddings, {
      collectionName: COLLECTION_NAME,
      index: client,
      collectionMetadata: { "hnsw:space": "cosine" },
    });

    return {
      vectorStore,
    };
  } catch (error) {
    console.error("Error creating Chroma vector store:", error);
    throw error;
  }
};
