import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = getDb();
  const domains = await db.domain.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          apiKeys: { select: { id: true, status: true } },
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
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { domain, userId: targetUserId, status } = await req.json();
    if (!domain) return NextResponse.json({ message: "Domain required" }, { status: 400 });

    let cleanDomain = domain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

    const db = getDb();
    const existing = await db.domain.findUnique({ where: { domain: cleanDomain } });
    if (existing) {
      return NextResponse.json({ message: "Domain already registered" }, { status: 409 });
    }

    const verificationToken = `2all-verify=${Math.random().toString(36).substring(2, 15)}`;
    const userId = targetUserId || (session.user as any).id;

    const newDomain = await db.domain.create({
      data: {
        userId,
        domain: cleanDomain,
        verificationToken,
        status: status || "VERIFIED",
        verifiedAt: status === "VERIFIED" ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            apiKeys: { select: { id: true, status: true } },
            widgetConfigs: { select: { id: true, publishedConfig: true, draftConfig: true } },
          },
        },
      },
    });

    return NextResponse.json(newDomain, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Failed to add domain" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, status, verified, userId: newUserId } = await req.json();
    const db = getDb();
    const isApproved = status === "VERIFIED" || status === "ACTIVE" || verified === true;
    const updated = await db.domain.update({
      where: { id },
      data: {
        ...(status ? { status: isApproved ? "ACTIVE" : status } : {}),
        ...(isApproved ? { verified: true, verifiedAt: new Date() } : {}),
        ...(newUserId ? { userId: newUserId } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Failed to update domain" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    const db = getDb();
    await db.domain.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Failed to delete domain" }, { status: 500 });
  }
}
