import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db"; // Pastikan lokasi file koneksi database benar
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { type } = req.query;
      const { userId } = req.cookies;
      if (type === "all") {
        const allPosts = await db.select().from(posts);
        return res.status(200).json({ message: "Semua posts", data: allPosts });
      }

      if (type === "me") {
        const user_id = Number(userId);
        if (!user_id) {
          return res.status(400).json({ message: "User ID tidak valid!" });
        }

        const myPosts = await db
          .select()
          .from(posts)
          .where(eq(posts.user_id, user_id));

        return res
          .status(200)
          .json({ message: "Post milik sendiri", data: myPosts });
      }

      return res.status(400).json({ message: "Query parameter tidak valid!" });
    }

    if (req.method === "POST") {
      const { user_id, content } = req.body;

      if (!user_id || !content) {
        return res
          .status(400)
          .json({ message: "user_id dan content wajib diisi!" });
      }

      const newPost = await db
        .insert(posts)
        .values({ user_id, content })
        .returning();
      return res
        .status(201)
        .json({ message: "Post berhasil ditambahkan", data: newPost });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
