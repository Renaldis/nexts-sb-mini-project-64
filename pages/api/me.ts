import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Response = {
  email?: string;
  full_name?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ data: { message: "Method not allowed" } });
  }

  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(401).json({ data: { message: "Unauthorized" } });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ data: { message: "User not found" } });
    }

    return res.status(200).json({ data: user[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ data: { message: "Internal Server Error" } });
  }
}
