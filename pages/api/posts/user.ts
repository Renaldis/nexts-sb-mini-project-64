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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userPost = await db
        .select()
        .from(posts)
        .where(eq(posts.user_id, Number(userId)));

      return res
        .status(200)
        .json({ message: "Post milik sendiri", data: userPost });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
