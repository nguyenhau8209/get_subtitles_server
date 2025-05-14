import express, { RequestHandler } from "express";
import { getSubtitles } from "youtube-captions-scraper";

const router = express.Router();

interface CaptionQuery {
  videoId?: string;
  lang?: string;
}
// @ts-ignore
const handler: RequestHandler = async (
  req: express.Request<{}, any, any, CaptionQuery>,
  res: express.Response
) => {
  const { videoId, lang = "de" } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId as string,
      lang: lang as string,
    });

    const result = captions.map((cap: Record<string, any>) => ({
      text: cap.text,
      startTime: parseFloat(cap.start),
      endTime: parseFloat(cap.start) + parseFloat(cap.dur),
    }));

    res.json(result);
  } catch (e) {
    console.error("Error fetching captions:", e);
    res.status(500).json({ error: "Failed to fetch captions", details: e });
  }
};

router.get("/", handler);

export default router;
