import { BrandLogo } from "../../../shared/components/BrandLogo";
import { ProfileCircle } from "../components/ProfileOrbit";
import { mockProfiles } from "../data/mockProfiles";

export function ProfilesPage() {
  return (
    <main className="relative min-h-screen">
      <ProfileCircle members={mockProfiles} />

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
