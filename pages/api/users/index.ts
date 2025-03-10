import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const allUsers = await db.select().from(users);

    return res.status(200).json({
      message: "Semua users",
      data: allUsers,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan server";

    return res.status(500).json({
      message: "Gagal mengambil data users",
      error: errorMessage,
    });
  }
}
