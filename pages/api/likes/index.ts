import { db } from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await db.select().from(likes);

    return res
      .status(201)
      .json({ message: "Likes added successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error adding likes", error });
  }
}
