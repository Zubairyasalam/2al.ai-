import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  try {
    const config = await prisma.widgetConfig.findUnique({
      where: { userId },
    });

    if (!config) {
      return NextResponse.json({ message: "No configuration found to publish." }, { status: 404 });
    }

    const updated = await prisma.widgetConfig.update({
      where: { userId },
      data: {
        publishedConfig: config.draftConfig,
        lastPublishedAt: new Date(),
      },
    });

    await logAudit({
      userId,
      action: "PUBLISHED_WIDGET_CONFIG",
      details: { configId: updated.id, publishedAt: updated.lastPublishedAt },
    });

    return NextResponse.json({
      success: true,
      publishedConfig: JSON.parse(updated.publishedConfig),
      lastPublishedAt: updated.lastPublishedAt,
    });
  } catch (error) {
    console.error("Error publishing widget config:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
