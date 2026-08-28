import { prisma } from "../lib/prisma.js";
import type { ProfileElement } from "../types/profile-elements.js";
import { normalizeProfileElements } from "../utils/profile-elements.js";

export async function findMembers() {
  const members = await prisma.member.findMany({
    select: {
      slug: true,
      displayName: true,
      avatarUrl: true,
      user: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });

  return members.map((member) => ({
    slug: member.slug,
    displayName: member.displayName,
    avatarUrl: member.avatarUrl ?? member.user.avatarUrl,
  }));
}

export async function findMemberBySlug(slug: string) {
  const member = await prisma.member.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      userId: true,
      slug: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      birthday: true,
      instagram: true,
      spotifyUrl: true,
      elements: true,
      user: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });

  if (!member) return null;

  const { user, elements, ...rest } = member;

  return {
    ...rest,
    avatarUrl: rest.avatarUrl ?? user.avatarUrl,
    elements: normalizeProfileElements(elements),
  };
}

export async function updateMemberBySlug(
  slug: string,
  data: {
    displayName?: string;
    bio?: string | null;
    instagram?: string | null;
    spotifyUrl?: string | null;
    elements?: ProfileElement[];
  },
) {
  const member = await prisma.member.update({
    where: {
      slug,
    },
    data,
    select: {
      id: true,
      userId: true,
      slug: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      birthday: true,
      instagram: true,
      spotifyUrl: true,
      elements: true,
      user: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });

  const { user, elements, ...rest } = member;

  return {
    ...rest,
    avatarUrl: rest.avatarUrl ?? user.avatarUrl,
    elements: normalizeProfileElements(elements),
  };
}
