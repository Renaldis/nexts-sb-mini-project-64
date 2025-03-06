import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;

  const userIdNumber = Number(userId);

  if (!userId || isNaN(userIdNumber)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const userById = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdNumber))
      .execute();

    if (!userById || userById.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: userById[0] });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan server";
    console.error("Database Error:", error);
    return res
      .status(500)
      .json({ message: "Gagal mengambil data user", error: errorMessage });
  }
}
