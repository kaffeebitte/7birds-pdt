import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BrandLogo } from "../../../shared/components/BrandLogo";
import { useProfile, useUpdateProfile } from "../hooks/useProfiles";
import type { ProfileElement } from "../types/elements";
import { LoadingScreen } from "../../../shared/components/LoadingScreen";
import { BackButton } from "../../../shared/components/BackButton";
import { ProfileCanvas } from "../components/profile-page/ProfileCanvas";
import { ProfileInstagram } from "../components/profile-page/ProfileInstagram";
import { ProfileSpotify } from "../components/profile-page/ProfileSpotify";
import { ProfileIdentity } from "../components/profile-page/ProfileIdentity";
import { ProfileBirthday } from "../components/profile-page/ProfileBirthday";
import { ProfileName } from "../components/profile-page/ProfileName";
import { ProfileElements } from "../components/profile-page/ProfileElements";
import { ProfileEditButton } from "../components/profile-page/ProfileEditButton";
import { useAuthStore } from "../../auth/store/authStore";
import { ElementAddButton } from "../components/profile-page/ElementAddButton";

export function MemberProfilePage() {
  const { slug } = useParams();

  const { data: profile, isLoading, isError } = useProfile(slug ?? "");
  const updateProfileMutation = useUpdateProfile(slug ?? "");
  const authUser = useAuthStore((state) => state.user);

  const [elements, setElements] = useState<ProfileElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  useEffect(() => {
    if (profile?.elements) {
      setElements(profile.elements ?? []);
    }
  }, [profile?.elements]);

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

  function handleAddText() {
    const newElement = {
      id: crypto.randomUUID(),
      type: "text" as const,
      content: "new text",
      x: 400,
      y: 200,
      width: 250,
      rotation: 0,
      zIndex: elements.length + 1,
    };

    const nextElements = [...elements, newElement];

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    saveElements(nextElements);
  }

  function handleDeleteElement(id: string) {
    const nextElements = elements.filter((element) => element.id !== id);

    setElements(nextElements);
    setSelectedElementId(null);
    saveElements(nextElements);
  }

  function handleEditElement(id: string) {
    const element = elements.find((element) => element.id === id);

    if (!element || element.type !== "text") {
      return;
    }

    setEditingElementId(id);
    setEditingText(element.content);
  }

  function handleSaveTextEdit() {
    if (!editingElementId) {
      return;
    }

    const content = editingText.trim();

    if (!content) {
      return;
    }

    const nextElements = elements.map((element) =>
      element.id === selectedElementId && element.type === "text"
        ? { ...element, content }
        : element,
    );

    setElements(nextElements);
    saveElements(nextElements);

    setEditingElementId(null);
    setEditingText("");
  }

  function saveElements(nextElements: ProfileElement[]) {
    updateProfileMutation.mutate({
      elements: nextElements,
    });
  }

  return (
    <ProfileCanvas>
      <BackButton />

      <ProfileElements
        elements={elements}
        selectedElementId={selectedElementId}
        onSelect={setSelectedElementId}
        onUpdate={(id, updates) => {
          setElements((prev) =>
            prev.map((element) =>
              element.id === id
                ? ({ ...element, ...updates } as ProfileElement)
                : element,
            ),
          );
        }}
        onDelete={handleDeleteElement}
        onEdit={handleEditElement}
        onUpdateEnd={(updatedElement) => {
          const nextElements = elements.map((element) =>
            element.id === updatedElement.id ? updatedElement : element,
          );

          setElements(nextElements);
          saveElements(nextElements);
        }}
      />
      {editingElementId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40">
          <div className="paper-pannel w-full max-w-md p-6">
            <h2 className="mono-label mb-6">Edit text</h2>
            <textarea
              className="ink-input w-full"
              rows={3}
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              autoFocus
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="ink-button"
                onClick={() => {
                  setEditingElementId(null);
                  setEditingText("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ink-button"
                onClick={handleSaveTextEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ProfileInstagram profile={profile} />
      <ProfileSpotify profile={profile} />
      <ProfileIdentity profile={profile} />
      <ProfileBirthday profile={profile} />
      <ProfileName profile={profile} />
      {isOwner && (
        <ElementAddButton
          onAddText={handleAddText}
          onAddImage={() => {
            console.log("add image");
          }}
        />
      )}
      {isOwner && <ProfileEditButton profile={profile} />}
      <BrandLogo />
    </ProfileCanvas>
  );
}
