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

    const apiKey = await prisma.apiKey.findFirst({
      where: isAdmin ? { id } : { id, userId },
    });

    if (!apiKey) {
      return NextResponse.json({ message: "API key not found or unauthorized." }, { status: 404 });
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: { status: "REVOKED" },
    });

    await logAudit({
      userId,
      action: "REVOKED_API_KEY",
      details: { keyId: id, name: apiKey.name },
    });

    return NextResponse.json(updatedKey);
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
