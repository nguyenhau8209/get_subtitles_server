declare module "youtube-captions-scraper" {
  export function getSubtitles(options: {
    videoID: string;
    lang?: string;
    headers?: {
      "User-Agent"?: string;
      [key: string]: string | undefined;
    };
  }): Promise<
    Array<{
      text: string;
      start: string;
      dur: string;
    }>
  >;
}
