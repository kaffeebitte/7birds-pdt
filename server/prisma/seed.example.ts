/**
 * Example seed data structure for 7 Birds.
 *
 * Purpose:
 * - Show the required fields for member accounts
 * - Document the expected password format
 * - Provide a template for future environments
 *
 * Password convention used in local development:
 * DDMMYY
 *
 * Example:
 * 01/01/2005 -> 010105
 */

export const MEMBERS = [
  {
    slug: "bird-01",
    displayName: "Example Member",

    // DDMMYY
    password: "010105",

    birthday: new Date("2005-01-01"),

    avatarUrl: "https://example.com/avatar.png",

    bio: "this is bio",
  },
];

/**
 * Example admin account
 */
export const ADMIN = {
  role: "ADMIN",

  password: "BirdAdmin@Admin",
};
