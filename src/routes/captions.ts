import express, { RequestHandler } from "express";
import { getSubtitles } from "youtube-captions-scraper";

const router = express.Router();

interface CaptionQuery {
  videoId?: string;
  lang?: string;
}

// @ts-ignore
const handler: RequestHandler<{}, any, any, CaptionQuery> = async (
  req,
  res
) => {
  const { videoId, lang = "de" } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId as string,
      lang: lang as string,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!captions || captions.length === 0) {
      return res.status(404).json({
        error: "No captions found",
        message:
          "This video might not have captions available in the requested language",
      });
    }

    const result = captions.map((cap: Record<string, any>) => ({
      text: cap.text,
      startTime: parseFloat(cap.start),
      endTime: parseFloat(cap.start) + parseFloat(cap.dur),
    }));

    res.json(result);
  } catch (e: any) {
    console.error("Error fetching captions:", e);
    res.status(500).json({
      error: "Failed to fetch captions",
      message: e.message,
      details: process.env.NODE_ENV === "development" ? e : undefined,
    });
  }
};

router.get("/", handler);

export default router;
