import { BrandLogo } from "../../../shared/components/BrandLogo";
import { ProfileCircle } from "../components/ProfileOrbit";
import { useProfiles } from "../hooks/useProfiles";
import { LoadingScreen } from "../../../shared/components/LoadingScreen";
import { mapProfile } from "../utils/mapProfiles";

export function ProfilesPage() {
  const { data: profiles, isLoading, error } = useProfiles();
  const members = mapProfile(profiles ?? []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Failed to load profiles</div>;
  }

  return (
    <main className="relative min-h-screen">
      <ProfileCircle members={members} />

      <div className="absolute bottom-32 left-16">
        <h1
          className="
        text-center
        text-3xl
        text-bird-green"
        >
          profiles 7 thằng cốt
        </h1>
      </div>

      <BrandLogo />
    </main>
  );
}
