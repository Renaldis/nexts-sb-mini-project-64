import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcrypt";

type Response = {
  insertedId?: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response[] }>
) {
  if (req.method !== "POST") {
    res.status(405).json({ data: [{ message: "Method not allowed" }] });
  }

  try {
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (payload.birth_date) {
      payload.birth_date = new Date(payload.birth_date);
    }

    if (payload.password) {
      const saltRounds = 10;
      payload.password = await bcrypt.hash(payload.password, saltRounds);
    }

    // Insert ke database
    const data = await db
      .insert(users)
      .values(payload)
      .returning({ insertedId: users.id });

    return res.status(201).json({ data });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ data: [{ message: "Internal Server Error" }] });
  }
}
