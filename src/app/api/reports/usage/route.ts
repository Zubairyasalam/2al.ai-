import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const plan = ((session.user as any).plan || "NONE").toUpperCase();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const usageLogs = await prisma.usageLog.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const currentMonthLogs = usageLogs.filter((l: any) => l.month === currentMonth);
  const totalPageViews = currentMonthLogs.reduce((acc: number, curr: any) => acc + curr.pageViews, 0);
  const totalWidgetLoads = currentMonthLogs.reduce((acc: number, curr: any) => acc + curr.widgetLoads, 0);

  let quotaLimit = 999;
  if (plan === "BUSINESS") quotaLimit = 29999;
  if (plan === "ENTERPRISE") quotaLimit = 999999;

  return NextResponse.json({
    month: currentMonth,
    plan,
    totalPageViews,
    totalWidgetLoads,
    quotaLimit,
    usagePercentage: Math.min(100, Math.round((totalPageViews / quotaLimit) * 100)),
    domains: usageLogs,
  });
}
