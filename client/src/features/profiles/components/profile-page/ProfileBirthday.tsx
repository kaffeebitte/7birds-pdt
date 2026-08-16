import type { ProfileDetail } from "../../types/profile";

type ProfileBirthdayProps = {
  profile: ProfileDetail;
};

function formatBirthday(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  return `${day} ${month} ${year}`;
}

export function ProfileBirthday({ profile }: ProfileBirthdayProps) {
  if (!profile.birthday) return null;

  return (
    <p
      className="
        absolute
        bottom-10
        right-10
        font-mono
        text-3xl
        text-bird-black
        "
    >
      {formatBirthday(profile.birthday)}
    </p>
  );
}
