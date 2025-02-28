import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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

  // const payload = JSON.parse(req.body);
  const payload =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  if (payload.birth_date) {
    payload.birth_date = new Date(payload.birth_date);
  }

  const data = await db
    .insert(users)
    .values(payload)
    .returning({ insertedId: users.id });

  return res.status(200).json({ data });
}
