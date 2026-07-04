import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { scanProject } from "@/lib/scanner";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ message: "projectId is required" }, { status: 400 });
    }

    // Verify the project belongs to the requesting user
    const userId = (session.user as { id: string }).id;
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Run the scan (this is synchronous for now — Phase 8 will add job queues)
    const result = await scanProject(project.id, project.url);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
