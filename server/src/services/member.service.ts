import { prisma } from "../lib/prisma.js";

export async function findMembers() {
  return prisma.member.findMany({
    select: {
      slug: true,
      displayName: true,
      avatarUrl: true,
    },
  });
}

export async function findMemberBySlug(slug: string) {
  return prisma.member.findUnique({
    where: {
      slug,
    },
  });
}
