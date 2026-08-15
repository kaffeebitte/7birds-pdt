import { MemberCircle } from "./MemberCircle";

type Profile = {
  slug: string;
  displayName: string;
  avatarUrl: string;

  position: {
    top: string;
    left: string;
  };

  namePosition: {
    top: string;
    left: string;
  };
};

type ProfileCircleProps = {
  members: Profile[];
};

export function ProfileCircle({ members }: ProfileCircleProps) {
  return (
    <section className="relative min-h-screen w-full">
      {members.map((member) => (
        <MemberCircle key={member.slug} {...member} />
      ))}
    </section>
  );
}
