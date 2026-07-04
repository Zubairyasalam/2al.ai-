/**
 * HTML Crawler — fetches raw HTML from a given URL.
 * Handles redirects, user-agent spoofing, and basic error handling.
 */

export interface CrawlResult {
  html: string;
  url: string;
  status: number;
  error?: string;
}

const USER_AGENT =
  "Mozilla/5.0 (compatible; 2all-ai-bot/1.0; +https://2all.ai/bot)";

export async function crawlUrl(url: string): Promise<CrawlResult> {
  try {
    // Ensure URL has a protocol
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      return {
        html: "",
        url: normalizedUrl,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    return { html, url: response.url, status: response.status };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      html: "",
      url,
      status: 0,
      error: `Failed to fetch URL: ${msg}`,
    };
  }
}
