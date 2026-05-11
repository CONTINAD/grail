import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostCreateClient } from "./PostCreateClient";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in?callbackUrl=/post/new");
  return <PostCreateClient />;
}
