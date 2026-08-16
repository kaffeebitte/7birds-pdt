import type { ProfileDetail } from "../../types/profile";

type ProfileIdentifyProps = {
  profile: ProfileDetail;
};

export function ProfileIdentity({ profile }: ProfileIdentifyProps) {
  return (
    <section
      className="
        absolute
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        flex
        flex-col
        items-center
        "
    >
      <img
        src={profile.avatarUrl}
        alt={profile.displayName}
        className="h-[280px] object-contain"
      />
      <p className="mt-4 font-body text-xl">{profile.bio}</p>
    </section>
  );
}
