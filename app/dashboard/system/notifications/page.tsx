import { getNotifications, markNotificationRead } from "../actions";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("userId")?.value ?? "";
  if (!userId) {
    const defaultUser = await prisma.user.findFirst();
    userId = defaultUser?.id ?? "";
  }
  const notifications = userId ? await getNotifications(userId) : [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Notifications</h1>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`p-3 border rounded flex items-center justify-between ${n.isRead ? "bg-white" : "bg-blue-50"}`}>
            <div>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-gray-500">{n.message}</p>
            </div>
            {!n.isRead && (
              <form action={markNotificationRead.bind(null, n.id)}>
                <button className="text-blue-600 hover:underline text-xs">Mark read</button>
              </form>
            )}
          </div>
        ))}
        {notifications.length === 0 && <p className="text-gray-400 text-sm">No notifications.</p>}
      </div>
    </div>
  );
}