import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { user_id, post_id } = req.body;

    if (!post_id || !user_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingLike = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.user_id, Number(user_id)),
          eq(likes.post_id, Number(post_id))
        )
      );

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(
          and(
            eq(likes.user_id, Number(user_id)),
            eq(likes.post_id, Number(post_id))
          )
        );

      return res.status(200).json({ message: "Unlike successfully" });
    }

    await db.insert(likes).values({
      post_id: Number(post_id),
      user_id: Number(user_id),
    });

    return res.status(201).json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error adding like:", error);
    return res.status(500).json({ message: "Error adding like", error });
  }
}
