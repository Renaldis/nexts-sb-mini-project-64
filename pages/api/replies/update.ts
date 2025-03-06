import { db } from "@/lib/db";
import { replies } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { content, post_id } = req.body;
  const userId = req.cookies.userId ? parseInt(req.cookies.userId, 10) : null;

  if (!post_id || !userId || !content?.trim()) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    const existingReply = await db
      .select()
      .from(replies)
      .where(and(eq(replies.post_id, post_id), eq(replies.user_id, userId)))
      .limit(1)
      .execute();

    if (existingReply.length === 0) {
      return res
        .status(404)
        .json({ message: "Reply not found or not authorized" });
    }

    if (existingReply[0].content === content.trim()) {
      return res.status(200).json({ message: "No changes detected" });
    }

    await db
      .update(replies)
      .set({ content: content.trim() })
      .where(and(eq(replies.post_id, post_id), eq(replies.user_id, userId)))
      .execute();

    return res.status(200).json({ message: "Reply updated successfully" });
  } catch (error: unknown) {
    console.error("Error updating reply:", error);
    return res.status(500).json({
      message: "Error updating reply",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
