import * as cheerio from "cheerio";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface AccessibilityIssue {
  type: string;
  severity: Severity;
  element: string;
  description: string;
  suggestion: string;
  wcag: string; // WCAG success criterion e.g. "1.1.1"
}

/**
 * Run all WCAG accessibility rule checks against parsed HTML.
 * Returns a list of issues with type, severity, element snippet, and fix suggestion.
 */
export function runAccessibilityRules(html: string): AccessibilityIssue[] {
  const $ = cheerio.load(html);
  const issues: AccessibilityIssue[] = [];

  // ─── 1.1.1 Non-text Content — Images must have alt text ────────────────────
  $("img").each((_, el) => {
    const alt = $(el).attr("alt");
    const src = $(el).attr("src") ?? "";
    const snippet = $.html(el)?.slice(0, 120) ?? "<img>";

    if (alt === undefined) {
      issues.push({
        type: "IMAGE_MISSING_ALT",
        severity: "CRITICAL",
        element: snippet,
        description: `Image is missing an "alt" attribute entirely.`,
        suggestion: `Add a descriptive alt attribute: alt="Description of image". If decorative, use alt="".`,
        wcag: "1.1.1",
      });
    } else if (alt === "" && !$(el).attr("role")) {
      // empty alt is fine only for decorative images — flag if suspicious
    } else if (
      /^(image|img|photo|picture|graphic|banner|untitled)[\d_\-.]*$/i.test(alt.trim())
    ) {
      issues.push({
        type: "IMAGE_MEANINGLESS_ALT",
        severity: "HIGH",
        element: snippet,
        description: `Image alt text "${alt}" is not descriptive.`,
        suggestion: `Replace with a meaningful description of what the image shows or conveys.`,
        wcag: "1.1.1",
      });
    }
  });

  // ─── 1.3.1 Info & Relationships — Inputs must have labels ──────────────────
  $("input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset'])").each(
    (_, el) => {
      const id = $(el).attr("id");
      const ariaLabel = $(el).attr("aria-label");
      const ariaLabelledBy = $(el).attr("aria-labelledby");
      const title = $(el).attr("title");
      const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
      const snippet = $.html(el)?.slice(0, 120) ?? "<input>";

      if (!hasLabel && !ariaLabel && !ariaLabelledBy && !title) {
        issues.push({
          type: "INPUT_MISSING_LABEL",
          severity: "CRITICAL",
          element: snippet,
          description: "Form input has no associated label, aria-label, or aria-labelledby.",
          suggestion: `Add a <label for="${id ?? 'inputId'}"> element or an aria-label attribute.`,
          wcag: "1.3.1",
        });
      }
    }
  );

  // ─── 1.4.3 Contrast — warn about very light text ───────────────────────────
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") ?? "";
    const snippet = $.html(el)?.slice(0, 120) ?? "<el>";
    if (/color:\s*#(eee|ddd|fff|f[0-9a-f]{5}|[0-9a-f]{6})/i.test(style)) {
      issues.push({
        type: "LOW_COLOR_CONTRAST",
        severity: "HIGH",
        element: snippet,
        description: "Element may have insufficient color contrast based on inline style.",
        suggestion: "Ensure text meets a minimum contrast ratio of 4.5:1 (WCAG AA). Use a contrast checker tool.",
        wcag: "1.4.3",
      });
    }
  });

  // ─── 2.4.1 — Skip navigation link ─────────────────────────────────────────
  const hasSkipLink =
    $('a[href="#main"], a[href="#content"], a[href="#maincontent"]').length > 0 ||
    $("a").filter((_, el) => /skip/i.test($(el).text())).length > 0;
  if (!hasSkipLink) {
    issues.push({
      type: "MISSING_SKIP_LINK",
      severity: "MEDIUM",
      element: "<body>",
      description: 'No "skip to main content" link found. Keyboard users cannot bypass navigation.',
      suggestion: 'Add <a href="#main-content" class="skip-link">Skip to main content</a> as the first element in the body.',
      wcag: "2.4.1",
    });
  }

  // ─── 2.4.2 — Page Title ────────────────────────────────────────────────────
  const titleText = $("title").text().trim();
  if (!titleText) {
    issues.push({
      type: "MISSING_PAGE_TITLE",
      severity: "CRITICAL",
      element: "<head>",
      description: "The page has no <title> element.",
      suggestion: "Add a descriptive <title> element in the <head> section.",
      wcag: "2.4.2",
    });
  }

  // ─── 1.3.1 — Heading hierarchy ─────────────────────────────────────────────
  const h1Count = $("h1").length;
  if (h1Count === 0) {
    issues.push({
      type: "MISSING_H1",
      severity: "HIGH",
      element: "<body>",
      description: "Page has no <h1> heading. Screen readers rely on headings for navigation.",
      suggestion: "Add a single <h1> element that describes the main content of the page.",
      wcag: "1.3.1",
    });
  } else if (h1Count > 1) {
    issues.push({
      type: "MULTIPLE_H1",
      severity: "MEDIUM",
      element: `Found ${h1Count} <h1> elements`,
      description: `Page has ${h1Count} <h1> headings. There should only be one per page.`,
      suggestion: "Keep only one <h1> as the main page title. Use <h2>–<h6> for subheadings.",
      wcag: "1.3.1",
    });
  }

  // ─── 2.4.4 — Links must have descriptive text ─────────────────────────────
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    const snippet = $.html(el)?.slice(0, 120) ?? "<a>";

    if (!text && !ariaLabel) {
      issues.push({
        type: "LINK_EMPTY",
        severity: "CRITICAL",
        element: snippet,
        description: "Link has no visible text or aria-label. Screen readers cannot describe this link.",
        suggestion: "Add descriptive text inside the <a> tag or use aria-label='Description'.",
        wcag: "2.4.4",
      });
    } else if (
      /^(click here|here|read more|more|learn more|link|button)$/i.test(text) &&
      !ariaLabel
    ) {
      issues.push({
        type: "LINK_NON_DESCRIPTIVE",
        severity: "MEDIUM",
        element: snippet,
        description: `Link text "${text}" is not descriptive out of context.`,
        suggestion: "Use descriptive link text that explains where the link goes, e.g., 'Read more about pricing'.",
        wcag: "2.4.4",
      });
    }
  });

  // ─── 4.1.2 — Buttons must have accessible names ───────────────────────────
  $("button").each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label");
    const title = $(el).attr("title");
    const snippet = $.html(el)?.slice(0, 120) ?? "<button>";

    if (!text && !ariaLabel && !title) {
      issues.push({
        type: "BUTTON_MISSING_NAME",
        severity: "CRITICAL",
        element: snippet,
        description: "Button has no accessible name. Screen readers cannot identify its purpose.",
        suggestion: "Add descriptive text inside the button or use aria-label='Button purpose'.",
        wcag: "4.1.2",
      });
    }
  });

  // ─── 1.3.5 — HTML lang attribute ──────────────────────────────────────────
  const htmlLang = $("html").attr("lang");
  if (!htmlLang) {
    issues.push({
      type: "MISSING_LANG",
      severity: "HIGH",
      element: "<html>",
      description: 'The <html> element is missing a "lang" attribute.',
      suggestion: 'Add lang="en" (or appropriate language code) to the <html> element.',
      wcag: "3.1.1",
    });
  }

  // ─── 2.1.1 — Interactive elements need keyboard access ────────────────────
  $("[onclick]").each((_, el) => {
    const tag = (el as any).name ?? "element";
    const snippet = $.html(el)?.slice(0, 120) ?? "<el>";
    const isNativelyFocusable = ["a", "button", "input", "select", "textarea"].includes(tag);

    if (!isNativelyFocusable) {
      const tabindex = $(el).attr("tabindex");
      if (tabindex === undefined) {
        issues.push({
          type: "KEYBOARD_INACCESSIBLE",
          severity: "HIGH",
          element: snippet,
          description: `<${tag}> has an onclick handler but is not keyboard focusable.`,
          suggestion: "Use a <button> element instead, or add tabindex='0' and a keydown event listener.",
          wcag: "2.1.1",
        });
      }
    }
  });

  // ─── iframe missing title ──────────────────────────────────────────────────
  $("iframe").each((_, el) => {
    const title = $(el).attr("title");
    const snippet = $.html(el)?.slice(0, 120) ?? "<iframe>";
    if (!title) {
      issues.push({
        type: "IFRAME_MISSING_TITLE",
        severity: "HIGH",
        element: snippet,
        description: "<iframe> is missing a title attribute. Screen readers cannot identify its content.",
        suggestion: "Add a descriptive title attribute: title='Embedded Map' or title='YouTube video player'.",
        wcag: "4.1.2",
      });
    }
  });

  return issues;
}

/**
 * Calculate an overall accessibility score (0–100) from the issues list.
 * Weighted by severity: CRITICAL=10pts, HIGH=5pts, MEDIUM=2pts, LOW=1pt
 */
export function calculateScore(issues: AccessibilityIssue[]): number {
  if (issues.length === 0) return 100;

  const penalty = issues.reduce((total, issue) => {
    const weights: Record<Severity, number> = { CRITICAL: 10, HIGH: 5, MEDIUM: 2, LOW: 1 };
    return total + weights[issue.severity];
  }, 0);

  const score = Math.max(0, 100 - penalty);
  return Math.round(score);
}
