import { youtube_v3 as YoutubeAPI } from "@googleapis/youtube";
import { env } from "~/env";

export const youtubeClient = new YoutubeAPI.Youtube({
  auth: env.GOOGLE_API_KEY,
});
