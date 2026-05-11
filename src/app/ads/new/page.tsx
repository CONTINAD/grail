import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdCreateClient } from "./AdCreateClient";

export default async function NewAdPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in?callbackUrl=/ads/new");
  return <AdCreateClient />;
}
