import type { ProfileDetail } from "../../types/profile";

type ProfileSpotifyProps = {
  profile: ProfileDetail;
};

export function ProfileSpotify({ profile }: ProfileSpotifyProps) {
  if (!profile.spotifyUrl) return null;

  return (
    <div className="absolute top-10 right-10">
      <iframe
        src={profile.spotifyUrl}
        width="320"
        height="100"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="border-0"
      />
    </div>
  );
}
