import prisma from "@/lib/db";

export async function logAudit({
  userId,
  action,
  details,
  ipAddress = "127.0.0.1",
}: {
  userId: string;
  action: string;
  details: any;
  ipAddress?: string;
}) {
  try {
    const detailsString = typeof details === "string" ? details : JSON.stringify(details);
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: detailsString,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
