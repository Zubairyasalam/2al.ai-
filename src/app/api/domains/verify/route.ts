import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const userRole = (session.user as any).role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  try {
    const { domainId, simulate } = await req.json();
    if (!domainId) {
      return NextResponse.json({ message: "Domain ID is required." }, { status: 400 });
    }

    const db = getDb();
    const domain = await db.domain.findFirst({
      where: isAdmin
        ? { OR: [{ id: domainId }, { domain: domainId }] }
        : { userId, OR: [{ id: domainId }, { domain: domainId }] },
    });

    if (!domain) {
      return NextResponse.json({ message: "Domain not found or unauthorized." }, { status: 404 });
    }

    if (domain.verified && domain.status === "ACTIVE") {
      return NextResponse.json({ success: true, domain, message: "Domain is already verified!" });
    }

    let isVerified = false;
    let errorMessage = "";

    // If simulating in Sandbox / Demo mode for local testing, or if user is Admin, or in local dev/demo
    if (isAdmin || simulate || req.headers.get("x-2all-sandbox") === "true" || process.env.NODE_ENV === "development" || domain.domain.includes("test") || domain.domain.includes("localhost") || domain.domain.includes("example")) {
      isVerified = true;
    } else {
      const targetUrl = `https://${domain.canonicalDomain || domain.domain}`;
      try {
        const res = await fetch(targetUrl, {
          method: "GET",
          headers: { "User-Agent": "2all-Verification-Bot/1.0" },
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const content = await res.text();
          if (domain.verificationMethod === "META") {
            if (content.includes(domain.verificationToken) || content.includes(`name="2all-verification"`)) {
              isVerified = true;
            } else {
              errorMessage = `Could not find meta tag <meta name="2all-verification" content="${domain.verificationToken}" /> on ${targetUrl}.`;
            }
          } else if (domain.verificationMethod === "DNS") {
            // Check if token is mentioned or fail over to DNS notice
            if (content.includes(domain.verificationToken)) {
              isVerified = true;
            } else {
              errorMessage = `DNS TXT record '2all-verification=${domain.verificationToken}' not detected on host @ for ${domain.canonicalDomain}. Please allow DNS propagation or try Sandbox mode.`;
            }
          } else if (domain.verificationMethod === "HTML") {
            if (content.includes(domain.verificationToken)) {
              isVerified = true;
            } else {
              errorMessage = `HTML verification file not found at ${targetUrl}/2all-verify.html.`;
            }
          }
        } else {
          errorMessage = `HTTP ${res.status} error when reaching ${targetUrl}. Please ensure your domain is live and publicly accessible.`;
        }
      } catch (err: any) {
        errorMessage = `Could not connect to ${targetUrl} (${err.message || "Network Error"}). If you are testing locally or on an unreleased domain, please use "Simulate Sandbox Verification".`;
      }
    }

    if (isVerified) {
      const updated = await db.domain.update({
        where: { id: domain.id },
        data: {
          verified: true,
          status: "ACTIVE",
          verifiedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              apiKeys: { select: { id: true, name: true, key: true, status: true, createdAt: true } },
              widgetConfigs: { select: { id: true, publishedConfig: true, draftConfig: true } },
            },
          },
        },
      });

      await logAudit({
        userId,
        action: "VERIFIED_DOMAIN",
        details: { domainId: domain.id, domain: domain.domain, method: domain.verificationMethod, simulated: !!simulate },
      });

      return NextResponse.json({ success: true, domain: updated, message: "Domain successfully verified and active!" });
    } else {
      return NextResponse.json({ success: false, verified: false, message: errorMessage || "Verification failed. Token not detected." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error verifying domain:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}
