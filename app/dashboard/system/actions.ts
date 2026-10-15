"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { getSessionOrgId } from "@/lib/session";

export async function getSettings() {
  const organizationId = await getSessionOrgId();
  return prisma.setting.findMany({ where: { organizationId } });
}

export async function upsertSetting(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const key = String(formData.get("key"));
  const value = String(formData.get("value"));

  await prisma.setting.upsert({
    where: { organizationId_key: { organizationId, key } },
    update: { value },
    create: { organizationId, key, value },
  });

  revalidatePath("/dashboard/system/settings");
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
}

export async function markNotificationRead(id: string) {
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/dashboard/system/notifications");
}

export async function createNotification(userId: string, title: string, message: string, link?: string) {
  const organizationId = await getSessionOrgId();
  await prisma.notification.create({
    data: { organizationId, userId, title, message, link: link || null },
  });
}

export async function getOrganizationDetails() {
  const organizationId = await getSessionOrgId();
  return prisma.organization.findUnique({ where: { id: organizationId } });
}

export async function updateOrganizationDetails(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const address = String(formData.get("address") || "");
  const phone = String(formData.get("phone") || "");

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      ...(name ? { name } : {}),
      email: email || null,
      address: address || null,
      phone: phone || null,
    },
  });

  revalidatePath("/dashboard/settings");
}
