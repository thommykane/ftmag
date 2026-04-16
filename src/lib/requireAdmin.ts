import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** Admin role from DB or env list (does not consider must-change-password). */
export async function userHasAdminRole(userId: string, email: string): Promise<boolean> {
  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });
    if (row?.isAdmin === true) return true;
  } catch {
    /* DB down — env list only */
  }
  return isAdminEmail(email);
}

/** For API routes: must be admin and must have finished mandatory password change. */
export async function sessionUserIsAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session.user) return false;
  if (session.user.mustChangePassword) return false;
  return userHasAdminRole(session.user.id, session.user.email);
}

/** Server pages for `/admin/*` tools (excludes login + change-password routes). */
export async function requireAdminPage(): Promise<void> {
  const session = await getSession();
  if (!session.user) redirect("/admin/login");
  if (!(await userHasAdminRole(session.user.id, session.user.email))) redirect("/");
  if (session.user.mustChangePassword) redirect("/admin/change-password");
}
