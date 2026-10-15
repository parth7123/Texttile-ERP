// lib/session.ts
import { prisma } from "@/lib/prisma";

// TEMPORARY placeholder — replace with real auth (NextAuth/Clerk/etc.)
async function getSession(): Promise<{ organizationId?: string } | null> {
  return null; // no real session system wired up yet
}

export async function getSessionOrgId() {
  const session = await getSession();

  if (session?.organizationId) {
    return session.organizationId;
  }

  const firstOrg = await prisma.organization.findFirst();
  if (firstOrg) return firstOrg.id;

  throw new Error("No active session or organization found in database.");
}