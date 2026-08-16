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
      rel="noreferer"
      className="
      absolute
      top-28
      left-20
      font-serif
      text-3xl
      text-bird-blue
      "
    >
      @{profile.instagram}
    </a>
  );
}
