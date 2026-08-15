import type { User, Member } from "../generated/prisma/client.js";

type UserWithMember = User & { member: Member | null };

export function serializeUser(user: UserWithMember) {
  return {
    id: user.id,
    role: user.role,
    member: user.member,
  };
}
