import { redirect } from "next/navigation";

// Redirect billing page to the unified install/license page with plan tab selected
export default function BillingPage() {
  redirect("/dashboard/install?tab=plan");
}
