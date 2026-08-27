import type React from "react";
import { useRef } from "react";
import type { ProfileElement } from "../../types/elements";

type ProfileElementsProps = {
  elements: ProfileElement[];
  selectedElementId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<ProfileElement>) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function ProfileElements({
  elements,
  selectedElementId,
  onSelect,
  onUpdate,
  onDelete,
  onEdit,
}: ProfileElementsProps) {
  const longPressTimerRef = useRef<number | null>(null);

  function handleDelete() {
    if (!selectedElementId) {
      return;
    }

    onDelete(selectedElementId);
    onSelect(null);
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLElement>,
    element: ProfileElement,
  ) {
    if (event.pointerType === "touch") {
      longPressTimerRef.current = window.setTimeout(() => {
        onSelect(element.id);
      }, 500);
    }

    if (selectedElementId !== element.id) {
      return;
    }

    event.stopPropagation();

    const clearLongPress = () => {
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    const startX = event.clientX;
    const startY = event.clientY;

    const initialX = element.x;
    const initialY = element.y;

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      clearLongPress();

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      onUpdate(element.id, {
        x: initialX + deltaX,
        y: initialY + deltaY,
      });
    };

    const handlePointerUp = () => {
      clearLongPress();

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function handleContextMenu(
    event: React.MouseEvent<HTMLElement>,
    element: ProfileElement,
  ) {
    event.preventDefault();
    event.stopPropagation();

    onSelect(element.id);
  }

  function handleCanvasPointerDown() {
    onSelect(null);
  }

  return (
    <>
      <div className="absolute inset-0" onPointerDown={handleCanvasPointerDown}>
        {selectedElementId && (
          <div
            className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 gap-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="ink-button"
              onClick={() => onEdit(selectedElementId)}
            >
              Edit
            </button>
            <button type="button" className="ink-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}

        {elements.map((element) => {
          if (element.type === "image") {
            return (
              <img
                key={element.id}
                src={element.url}
                alt=""
                className={`absolute ${selectedElementId === element.id ? "outline outline-2 outline-bird-blue" : ""}`}
                onPointerDown={(e) => handlePointerDown(e, element)}
                onContextMenu={(e) => handleContextMenu(e, element)}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                  touchAction: "none",
                }}
              />
            );
          }

          if (element.type === "text") {
            return (
              <div
                key={element.id}
                className={`absolute ${selectedElementId === element.id ? "outline outline-2 outline-bird-blue" : ""}`}
                onPointerDown={(e) => handlePointerDown(e, element)}
                onContextMenu={(e) => handleContextMenu(e, element)}
                style={{
                  left: element.x,
                  top: element.y,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                  touchAction: "none",
                }}
              >
                {element.content}
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
