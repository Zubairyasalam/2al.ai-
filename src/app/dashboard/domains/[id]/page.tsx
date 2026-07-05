import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/db";
import DomainDetails from "@/components/dashboard/DomainDetails";

export default async function DomainDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id as string;

  let domain: any = null;
  try {
    domain = await prisma.domain.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            widgetConfigs: {
              select: { id: true, publishedConfig: true, draftConfig: true },
            },
          },
        },
        apiKeys: {
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, key: true, status: true, createdAt: true, lastUsedAt: true },
        },
      },
    });
  } catch (err) {
    console.error("Failed to fetch domain:", err);
  }

  if (!domain) {
    notFound();
  }

  const userName = session.user.name || "Customer";

  return (
    <div className="w-full">
      <DomainDetails
        domain={JSON.parse(JSON.stringify(domain))}
        userName={userName}
      />
    </div>
  );
}
