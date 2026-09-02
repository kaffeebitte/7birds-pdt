import type { ProfileDetail } from "../../types/profile";

type ProfileNameProps = {
  profile: ProfileDetail;
};

export function ProfileName({ profile }: ProfileNameProps) {
  return (
    <p
      className="
        absolute
        bottom-28
        left-10
        font-body
        text-2xl
        text-bird-green
        "
    >
      {`${profile.displayName}`}
    </p>
  );
}
