import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ data: { message: "Method not allowed" } });
  }

  const { email, password } = JSON.parse(req.body);

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const storedUser = user[0];

    // Cek apakah password cocok
    const isMatch = await bcrypt.compare(password, storedUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
