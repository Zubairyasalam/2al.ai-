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
  const apiKeys = await db.apiKey.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apiKeys);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const userRole = (session.user as any).role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  try {
    const { name, domainId, domainName } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ message: "Key name is required." }, { status: 400 });
    }

    const db = getDb();
    let targetUserId = userId;
    if (domainId) {
      try {
        const dom = await db.domain.findFirst({
          where: { OR: [{ id: domainId }, { domain: domainId }] },
        });
        if (dom) {
          const isDomVerified = dom.verified === true || dom.status === "ACTIVE" || dom.status === "VERIFIED";
          if (!isDomVerified && !isAdmin) {
            return NextResponse.json({ message: "Only verified and active domains can be selected for API key generation." }, { status: 400 });
          }
          if (dom.userId) {
            targetUserId = dom.userId;
          }
        }
      } catch (domErr) {
        console.warn("Could not query domain for owner userId:", domErr);
      }
    }

    // Generate PUB_ + 20 hex chars e.g. PUB_E5EC17616019B6CED331
    const hex1 = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
    const hex2 = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
    const hex3 = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
    const generatedKey = `PUB_${hex1}${hex2}${hex3}`;

    let newKey;
    try {
      newKey = await db.apiKey.create({
        data: {
          userId: targetUserId,
          name: name.trim(),
          key: generatedKey,
          status: "ACTIVE",
          domainId: domainId || null,
          domainName: domainName || null,
        },
      });
    } catch (createErr: any) {
      console.warn("Retrying apiKey create without domainId/domainName due to schema sync:", createErr.message);
      newKey = await db.apiKey.create({
        data: {
          userId: targetUserId,
          name: name.trim(),
          key: generatedKey,
          status: "ACTIVE",
        },
      });
    }

    await logAudit({
      userId,
      action: "CREATED_API_KEY",
      details: { keyId: newKey.id, name: newKey.name, domainName: newKey.domainName },
    });

    return NextResponse.json(newKey, { status: 201 });
  } catch (error: any) {
    console.error("Error creating API key:", error);
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: 500 });
  }
}
