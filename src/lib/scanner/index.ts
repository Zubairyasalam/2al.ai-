import { crawlUrl } from "./crawler";
import { runAccessibilityRules, calculateScore } from "./rules";
import prisma from "@/lib/db";

export interface ScanResult {
  scanId: string;
  score: number;
  issuesCount: number;
  status: "COMPLETED" | "FAILED";
  error?: string;
}

/**
 * Main scanner — crawls a URL, runs WCAG rules, saves issues to DB.
 */
export async function scanProject(
  projectId: string,
  url: string
): Promise<ScanResult> {
  // Create a PENDING scan record first
  const scan = await prisma.scan.create({
    data: {
      projectId,
      status: "PENDING",
    },
  });

  try {
    // 1. Crawl the URL
    const { html, error: crawlError } = await crawlUrl(url);

    if (crawlError || !html) {
      await prisma.scan.update({
        where: { id: scan.id },
        data: { status: "FAILED" },
      });
      return { scanId: scan.id, score: 0, issuesCount: 0, status: "FAILED", error: crawlError };
    }

    // 2. Run all accessibility rules
    const issues = runAccessibilityRules(html);
    const score = calculateScore(issues);

    // 3. Save issues to DB
    if (issues.length > 0) {
      await prisma.issue.createMany({
        data: issues.map((issue) => ({
          scanId: scan.id,
          type: issue.type,
          severity: issue.severity,
          element: issue.element,
          description: issue.description,
          suggestion: issue.suggestion,
        })),
      });
    }

    // 4. Update scan with final results
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: "COMPLETED",
        score,
        issuesCount: issues.length,
        completedAt: new Date(),
      },
    });

    return { scanId: scan.id, score, issuesCount: issues.length, status: "COMPLETED" };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    await prisma.scan.update({
      where: { id: scan.id },
      data: { status: "FAILED" },
    });
    return { scanId: scan.id, score: 0, issuesCount: 0, status: "FAILED", error: msg };
  }
}
