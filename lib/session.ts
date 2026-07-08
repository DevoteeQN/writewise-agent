import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type SessionWithUserId = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
};

export async function requireUserId() {
  const session = (await getServerSession(authOptions)) as SessionWithUserId | null;

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

export async function getCurrentUserId() {
  const session = (await getServerSession(authOptions)) as SessionWithUserId | null;
  return session?.user?.id ?? null;
}
