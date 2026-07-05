import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DomainsClient from "@/components/dashboard/DomainsClient";

export const metadata = {
  title: "My Domains | 2all.ai",
  description: "Manage your domains, verify ownership, and deploy the accessibility widget.",
};

export default async function DomainsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id as string;
  const userName = session.user.name || "Customer";

  let domains: any[] = [];
  try {
    domains = await prisma.domain.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            apiKeys: {
              select: { id: true, name: true, key: true, status: true, createdAt: true },
              orderBy: { createdAt: "desc" },
            },
            widgetConfigs: {
              select: { id: true, publishedConfig: true, draftConfig: true },
            },
          },
        },
        _count: { select: { apiKeys: true } },
      },
    });
  } catch (err) {
    console.error("Failed to fetch domains:", err);
  }

  return (
    <div className="w-full">
      <DomainsClient
        initialDomains={JSON.parse(JSON.stringify(domains))}
        userName={userName}
      />
    </div>
  );
}
