import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type Notification = {
  id: number;
  user_id: number;
  sender_id: number;
  type: string;
  post_id?: number | null;
  reply_id?: number | null;
  like_id?: number | null;
  message: string;
  is_read?: boolean | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { user_id } = req.query;
      if (!user_id)
        return res.status(400).json({ error: "User ID diperlukan" });

      const data: Notification[] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.user_id, parseInt(user_id as string)));

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { user_id, sender_id, type, post_id, message } = req.body;
      if (!user_id || !sender_id || !type || !message) {
        return res.status(400).json({ error: "Data tidak lengkap" });
      }

      if (type === "like") {
        const existingLike = await db
          .select()
          .from(notifications)
          .where(
            and(
              eq(notifications.user_id, user_id),
              eq(notifications.sender_id, sender_id),
              eq(notifications.type, "like"),
              eq(notifications.post_id, post_id)
            )
          );

        if (existingLike.length > 0) {
          return res.status(200).json({ message: "Notifikasi like sudah ada" });
        }
      }

      await db.insert(notifications).values({
        user_id,
        sender_id,
        type,
        post_id,
        message,
      });

      return res.status(201).json({ message: "Notifikasi berhasil dibuat" });
    }

    if (req.method === "PATCH") {
      const { id } = req.body;
      if (!id)
        return res.status(400).json({ error: "ID notifikasi diperlukan" });

      const updated = await db
        .update(notifications)
        .set({ is_read: true })
        .where(eq(notifications.id, id));

      if (updated) {
        await db.delete(notifications).where(eq(notifications.id, id));
      }

      return res
        .status(200)
        .json({
          message: "Notifikasi diperbarui dan dihapus jika sudah dibaca",
        });
    }

    return res.status(405).json({ error: "Method tidak diizinkan" });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    });
  }
}
