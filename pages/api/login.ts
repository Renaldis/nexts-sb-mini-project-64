import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log("Incoming request body:", req.body);

    const { email, password } = req.body;

    console.log("Looking for user with email:", email);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      console.log("User not found");
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const storedUser = user[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, storedUser.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: storedUser.id, email: storedUser.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        userId: storedUser.id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
