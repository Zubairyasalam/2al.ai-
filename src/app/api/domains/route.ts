import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const userRole = (session.user as any).role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const db = getDb();
  const domains = await db.domain.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json(domains);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  try {
    const { websiteName, domain, environment, verificationMethod, notes } = await req.json();
    if (!domain) {
      return NextResponse.json({ message: "Domain name is required." }, { status: 400 });
    }

    // Clean up domain
    let cleanDomain = domain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

    const db = getDb();
    // Check if domain already exists
    const existing = await db.domain.findFirst({
      where: {
        OR: [
          { domain: cleanDomain },
          { canonicalDomain: cleanDomain },
          { domain: `www.${cleanDomain}` },
        ],
      },
    });
    if (existing) {
      return NextResponse.json({ message: "Domain is already registered in the platform." }, { status: 409 });
    }

    const verificationToken = `2all-verify-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;

    const newDomain = await db.domain.create({
      data: {
        userId,
        websiteName: websiteName || cleanDomain,
        domain: cleanDomain,
        canonicalDomain: cleanDomain,
        environment: environment || "PRODUCTION",
        verificationMethod: verificationMethod || "META",
        verificationToken,
        status: "PENDING_VERIFICATION",
        verified: false,
        notes: notes || "",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            apiKeys: { select: { id: true, name: true, key: true, status: true } },
            widgetConfigs: { select: { id: true, publishedConfig: true, draftConfig: true } },
          },
        },
      },
    });

    await logAudit({
      userId,
      action: "REGISTERED_DOMAIN",
      details: { domainId: newDomain.id, domain: cleanDomain, websiteName: newDomain.websiteName, environment: newDomain.environment },
    });

    return NextResponse.json(newDomain, { status: 201 });
  } catch (error: any) {
    console.error("Error creating domain:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const userRole = (session.user as any).role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Domain ID is required." }, { status: 400 });
    }

    const db = getDb();
    const domain = await db.domain.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!domain) {
      return NextResponse.json({ message: "Domain not found or unauthorized." }, { status: 404 });
    }

    await db.domain.delete({
      where: { id },
    });

    await logAudit({
      userId,
      action: "DELETED_DOMAIN",
      details: { domainId: id, domain: domain.domain },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting domain:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}
