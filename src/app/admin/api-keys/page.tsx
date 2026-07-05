import { redirect } from "next/navigation";

export default function AdminApiKeysPage() {
  redirect("/admin/dashboard?tab=api-keys");
}
