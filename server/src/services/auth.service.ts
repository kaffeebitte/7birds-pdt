import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { serializeUser } from "../utils/serializeUser.js";

type LoginInput = {
  userId: string;
  password: string;
};

export async function login({ userId, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { member: true },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as NonNullable<
    SignOptions["expiresIn"]
  >;

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn },
  );

  return {
    token,
    user: serializeUser(user),
  };
}
