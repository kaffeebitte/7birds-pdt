import { Link } from "react-router-dom";

type MemberCircleProps = {
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

export function MemberCircle({
  slug,
  displayName,
  avatarUrl,
  position,
  namePosition,
}: MemberCircleProps) {
  return (
    <Link
      to={`/profiles/${slug}`}
      className="absolute flex flex-col items-center"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      <img
        src={avatarUrl}
        alt={displayName}
        className="h-[120px] md:h-[180px] lg:h-[280px] object-contain"
      />
      <span
        className="absolute font-body home-link text-bird-blue whitespace-nowrap"
        style={{
          top: namePosition.top,
          left: namePosition.left,
          transform: "translate(-50%, -50%)",
        }}
      >
        {displayName}
      </span>
    </Link>
  );
}
