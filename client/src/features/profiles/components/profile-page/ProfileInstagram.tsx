import type { ProfileDetail } from "../../types/profile";

type ProfileInstagramProps = {
  profile: ProfileDetail;
};

export function ProfileInstagram({ profile }: ProfileInstagramProps) {
  if (!profile.instagram) return null;

  return (
    <a
      href={`https://instagram.com/${profile.instagram}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
      absolute
      top-24
      left-12
      font-serif
      text-3xl
      text-bird-blue
      "
    >
      @{profile.instagram}
    </a>
  );
}
