import { db } from "@/lib/db";
import { replies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;

  if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ message: "reply_id is required" });
    }

    try {
      await db.delete(replies).where(eq(replies.id, id));

      return res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan server";

      return res
        .status(500)
        .json({ message: "Error deleting reply", error: errorMessage });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
