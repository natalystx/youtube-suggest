import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GOOGLE_API_KEY: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    CHROMA_TENANT: z.string().min(1),
    CHROMA_DATABASE: z.string().min(1),
    CHROMA_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CHROMA_TENANT: process.env.CHROMA_TENANT,
    CHROMA_DATABASE: process.env.CHROMA_DATABASE,
    CHROMA_API_KEY: process.env.CHROMA_API_KEY,
  },
});
