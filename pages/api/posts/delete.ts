import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { id } = req.body;

    if (!id || typeof id !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "ID harus valid" });
    }

    // Cek apakah post dengan ID tersebut ada
    const postExists = await db.select().from(posts).where(eq(posts.id, id));

    if (!postExists.length) {
      return res
        .status(404)
        .json({ success: false, message: "Post tidak ditemukan" });
    }

    // Hapus post dari database
    await db.delete(posts).where(eq(posts.id, id));

    return res
      .status(200)
      .json({ success: true, message: "Post berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus post:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}
