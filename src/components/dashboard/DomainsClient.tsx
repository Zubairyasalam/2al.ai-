"use client";

import { useRouter } from "next/navigation";
import DomainOnboarding from "@/components/dashboard/DomainOnboarding";

interface DomainsClientProps {
  initialDomains: any[];
  userName: string;
}

export default function DomainsClient({ initialDomains, userName }: DomainsClientProps) {
  const router = useRouter();

  const handleDomainClick = (domain: any) => {
    router.push(`/dashboard/domains/${domain.id}`);
  };

  return (
    <DomainOnboarding
      initialDomains={initialDomains}
      userName={userName}
      onDomainClick={handleDomainClick}
    />
  );
}
