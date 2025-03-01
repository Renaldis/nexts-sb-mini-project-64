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
    console.log("Users Data:", allUsers);

    return res.status(200).json({
      message: "Semua users",
      data: allUsers,
    });
  } catch (error: any) {
    console.error("Database Error:", error);

    return res.status(500).json({
      message: "Gagal mengambil data users",
      error: error.message,
    });
  }
}
