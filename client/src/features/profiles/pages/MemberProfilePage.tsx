import { useParams } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";
import { useProfile } from "../hooks/useProfiles";
import { LoadingScreen } from "../../../shared/components/LoadingScreen";
import { BackButton } from "../../../shared/components/BackButton";
import { ProfileCanvas } from "../components/profile-page/ProfileCanvas";
import { ProfileInstagram } from "../components/profile-page/ProfileInstagram";
import { ProfileSpotify } from "../components/profile-page/ProfileSpotify";
import { ProfileIdentity } from "../components/profile-page/ProfileIdentity";
import { ProfileBirthday } from "../components/profile-page/ProfileBirthday";
import { ProfileName } from "../components/profile-page/ProfileName";
import { ProfileEditButton } from "../components/profile-page/ProfileEditButton";
import { useAuthStore } from "../../auth/store/authStore";

export function MemberProfilePage() {
  const { slug } = useParams();

  const { data: profile, isLoading, isError } = useProfile(slug ?? "");
  const authUser = useAuthStore((state) => state.user);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const isOwner = authUser?.id === profile.userId;

  return (
    <ProfileCanvas>
      <BackButton />
      <ProfileInstagram profile={profile} />
      <ProfileSpotify profile={profile} />
      <ProfileIdentity profile={profile} />
      <ProfileBirthday profile={profile} />
      <ProfileName profile={profile} />
      {isOwner && <ProfileEditButton profile={profile} />}
      <BrandLogo />
    </ProfileCanvas>
  );
}
