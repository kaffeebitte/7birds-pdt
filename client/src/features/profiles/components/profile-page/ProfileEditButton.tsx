import { useEffect, useState, type SyntheticEvent } from "react";
import type { ProfileDetail } from "../../types/profile.ts";
import { useUpdateProfile } from "../../hooks/useProfiles.ts";

type ProfileEditButtonProps = { profile: ProfileDetail };

function normalizeSpotifyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^https:\/\/open\.spotify\.com\/(?:embed\/)?(track|album|playlist)\/([^/?#]+)/,
  );

  if (!match) return null;

  const [, type, id] = match;
  return `https://open.spotify.com/embed/${type}/${id}`;
}

export function ProfileEditButton({ profile }: ProfileEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    instagram: profile.instagram ?? "",
    spotifyUrl: profile.spotifyUrl ?? "",
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        displayName: profile.displayName,
        bio: profile.bio ?? "",
        instagram: profile.instagram ?? "",
        spotifyUrl: profile.spotifyUrl ?? "",
      });
    }
  }, [
    profile.displayName,
    profile.bio,
    profile.instagram,
    profile.spotifyUrl,
    isOpen,
  ]);

  function resetForm() {
    setForm({
      displayName: profile.displayName,
      bio: profile.bio ?? "",
      instagram: profile.instagram ?? "",
      spotifyUrl: profile.spotifyUrl ?? "",
    });

    setError(null);
    setFormError(null);
  }

  const updateProfileMutation = useUpdateProfile(profile.slug);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    setFormError(null);
    setError(null);

    if (!form.displayName.trim()) {
      setFormError("Display name cannot be empty");
      return;
    }

    const instagram = form.instagram
      .trim()
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/^@/, "")
      .replace(/\/$/, "");

    if (instagram && !/^[a-zA-Z0-9._]+$/.test(instagram)) {
      setFormError("Invalid Instagram username");
      return;
    }

    const trimmedSpotifyUrl = form.spotifyUrl.trim();
    let normalizedSpotifyUrl: string | null = null;

    if (trimmedSpotifyUrl) {
      normalizedSpotifyUrl = normalizeSpotifyUrl(trimmedSpotifyUrl);
      if (!normalizedSpotifyUrl) {
        setFormError("Invalid Spotify URL");
        return;
      }
    }

    const payload = {
      displayName: form.displayName.trim(),
      bio: form.bio.trim() || null,
      instagram,
      spotifyUrl: normalizedSpotifyUrl,
    };

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        setError(null);
        setFormError(null);
      },
      onError: (error: unknown) => {
        const responseMessage = (error as any)?.response?.data?.message;

        if (typeof responseMessage === "string" && responseMessage.trim()) {
          setError(responseMessage);
          return;
        }

        if (error instanceof Error && error.message) {
          setError(error.message);
          return;
        }

        setError("Unable to update profile");
      },
    });
  }

  return (
    <>
      <button
        type="button"
        className="ink-button absolute bottom-28 right-10"
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
      >
        Edit profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="paper-panel w-full max-w-xl p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <h2 id="edit-profile-title" className="mono-label mb-6">
              Edit profile
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="display-name" className="mono-label mb-2 block">
                  Display name
                </label>
                <input
                  id="display-name"
                  className="ink-input w-full"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mono-label mb-2 block">Bio</label>
                <textarea
                  className="ink-input w-full"
                  rows={3}
                  value={form.bio}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mono-label mb-2 block">Instagram</label>
                <input
                  className="ink-input w-full"
                  value={form.instagram}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mono-label mb-2 block">
                  Fav song on Spotify
                </label>
                <input
                  className="ink-input w-full"
                  value={form.spotifyUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      spotifyUrl: e.target.value,
                    }))
                  }
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-bird-pink">{error}</p>
              )}

              {formError && (
                <p className="text-sm font-bold text-bird-pink">{formError}</p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="ink-button"
                  disabled={updateProfileMutation.isPending}
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ink-button"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
