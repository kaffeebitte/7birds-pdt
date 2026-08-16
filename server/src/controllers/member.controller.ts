import type { Request, Response } from "express";
import { findMembers, findMemberBySlug } from "../services/member.service.js";

export async function getMembers(req: Request, res: Response) {
  const members = await findMembers();

  res.json(members);
}

export async function getMemberBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  if (typeof slug !== "string" || !slug.trim()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing slug parameter",
    });
  }

  const member = await findMemberBySlug(slug);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found",
    });
  }

  res.json(member);
}
