import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const userRole = (session.user as any).role || "USER";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    const oldKey = await prisma.apiKey.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!oldKey) {
      return NextResponse.json({ message: "API key not found or unauthorized." }, { status: 404 });
    }

    // Revoke old key
    await prisma.apiKey.update({
      where: { id },
      data: { status: "REVOKED" },
    });

    // Generate PUB_ + 20 hex chars e.g. PUB_E5EC17616019B6CED331
    const hex1 = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
    const hex2 = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");
    const hex3 = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
    const generatedKey = `PUB_${hex1}${hex2}${hex3}`;

    let newKey;
    try {
      newKey = await prisma.apiKey.create({
        data: {
          userId: oldKey.userId,
          name: `${oldKey.name} (Rotated)`,
          key: generatedKey,
          status: "ACTIVE",
          domainId: oldKey.domainId,
          domainName: oldKey.domainName,
        },
      });
    } catch (createErr: any) {
      console.warn("Retrying rotate apiKey create without domainId/domainName due to schema sync:", createErr.message);
      newKey = await prisma.apiKey.create({
        data: {
          userId: oldKey.userId,
          name: `${oldKey.name} (Rotated)`,
          key: generatedKey,
          status: "ACTIVE",
        },
      });
    }

    await logAudit({
      userId,
      action: "ROTATED_API_KEY",
      details: { oldKeyId: id, newKeyId: newKey.id, name: newKey.name },
    });

    return NextResponse.json({ oldKeyId: id, newKey });
  } catch (error) {
    console.error("Error rotating API key:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
