import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

export async function requireMember() {
  const session = await getSession();

  if (!session || !["therapist", "admin"].includes(session.role) || session.membershipState !== "active") {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  return session;
}
