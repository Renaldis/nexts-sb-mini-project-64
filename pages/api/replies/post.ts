import { db } from "@/lib/db";
import { replies } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  if (req.method === "GET") {
    const { post_id } = req.query;

    const postIdNumber = Number(post_id);
    if (!postIdNumber) {
      try {
        const response = await db.select().from(replies);

        return res.status(200).json({
          message: "Success get data",
          data: response || [],
        });
      } catch (error) {
        return res.status(500).json({ message: "Error fetching replies" });
      }
    }

    try {
      const response = await db
        .select()
        .from(replies)
        .where(sql`${replies.post_id} = ${postIdNumber}`);

      return res.status(200).json({
        message: "Success get data",
        replies: response || [],
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching replies" });
    }
  }

  if (req.method === "POST") {
    const { content, post_id } = req.body;
    const { userId } = req.cookies;

    if (!post_id || !userId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      await db.insert(replies).values({
        post_id,
        user_id: Number(userId),
        content,
      });

      return res.status(201).json({ message: "Reply added successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error adding reply", error });
    }
  }

  if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ message: "reply_id is required" });
    }

    try {
      await db.delete(replies).where(eq(replies.id, id));

      return res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting reply", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
