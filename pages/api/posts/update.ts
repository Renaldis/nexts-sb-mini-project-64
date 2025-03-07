import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { id, content } = req.body;

    if (!id || !content) {
      return res
        .status(400)
        .json({ success: false, message: "ID dan content harus diisi" });
    }

    const editPost = await db
      .update(posts)
      .set({ content, updated_at: new Date() })
      .where(eq(posts.id, id))
      .returning();

    if (editPost.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post tidak ditemukan" });
    }

    return res.status(200).json({
      success: true,
      message: "Post berhasil diperbarui",
      data: editPost[0],
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
