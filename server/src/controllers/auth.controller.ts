import { prisma } from "../lib/prisma.js";
import { serializeUser } from "../utils/serializeUser.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { login as loginUser } from "../services/auth.service.js";

export async function login(req: Request, res: Response) {
  const { userId, password } = req.body;

  if (
    typeof userId != "string" ||
    !userId.trim() ||
    typeof password != "string" ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "userId and password are required",
    });
  }

  try {
    const result = await loginUser({ userId, password });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid userId or password",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      include: { member: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: serializeUser(user),
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get current user",
    });
  }
}
