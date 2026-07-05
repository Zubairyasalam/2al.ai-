import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";

const DEFAULT_CONFIG = {
  primaryColor: "#2563eb",
  position: "bottom-right",
  size: "medium",
  enabledTools: [
    "text-resize",
    "high-contrast",
    "dark-mode",
    "highlight-links",
    "readable-font",
    "screen-reader",
  ],
  buttonIcon: "universal",
  autoCheck: true,
};

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  let config = await prisma.widgetConfig.findUnique({
    where: { userId },
  });

  if (!config) {
    const defaultJson = JSON.stringify(DEFAULT_CONFIG);
    config = await prisma.widgetConfig.create({
      data: {
        userId,
        draftConfig: defaultJson,
        publishedConfig: defaultJson,
      },
    });
  }

  return NextResponse.json({
    id: config.id,
    draftConfig: JSON.parse(config.draftConfig || "{}"),
    publishedConfig: JSON.parse(config.publishedConfig || "{}"),
    lastPublishedAt: config.lastPublishedAt,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  try {
    const { draftConfig } = await req.json();
    if (!draftConfig) {
      return NextResponse.json({ message: "draftConfig is required." }, { status: 400 });
    }

    const draftString = JSON.stringify(draftConfig);

    const updated = await prisma.widgetConfig.upsert({
      where: { userId },
      update: { draftConfig: draftString },
      create: {
        userId,
        draftConfig: draftString,
        publishedConfig: JSON.stringify(DEFAULT_CONFIG),
      },
    });

    await logAudit({
      userId,
      action: "UPDATED_DRAFT_CONFIG",
      details: { configId: updated.id },
    });

    return NextResponse.json({
      success: true,
      draftConfig: JSON.parse(updated.draftConfig),
    });
  } catch (error) {
    console.error("Error saving draft config:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
