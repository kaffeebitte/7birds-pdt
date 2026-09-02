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
  onUpdateEnd: (element: ProfileElement) => void;
};

export function ProfileElements({
  elements,
  selectedElementId,
  onSelect,
  onUpdate,
  onDelete,
  onEdit,
  onUpdateEnd,
}: ProfileElementsProps) {
  const longPressTimerRef = useRef<number | null>(null);
  const selectedElement = elements.find(
    (element) => element.id === selectedElementId,
  );

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

    const handlePointerUp = (upEvent: globalThis.PointerEvent) => {
      clearLongPress();

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      const deltaX = upEvent.clientX - startX;
      const deltaY = upEvent.clientY - startY;

      const updatedElement = {
        ...element,
        x: initialX + deltaX,
        y: initialY + deltaY,
      };

      onUpdateEnd(updatedElement);
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

  function handleResizePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    element: ProfileElement,
  ) {
    event.stopPropagation();

    const startX = event.clientX;
    const initialWidth = element.width;

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(700, Math.max(100, initialWidth + deltaX));

      onUpdate(element.id, { width: newWidth });
    };

    const handlePointerUp = (upEvent: globalThis.PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      const deltaX = upEvent.clientX - startX;

      const newWidth = Math.min(700, Math.max(100, initialWidth + deltaX));

      const updatedElement: ProfileElement = {
        ...element,
        width: newWidth,
      };

      onUpdateEnd(updatedElement);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <>
      <div className="absolute inset-0" onPointerDown={handleCanvasPointerDown}>
        {selectedElementId && (
          <div
            className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 gap-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {selectedElement?.type === "text" && (
              <button
                type="button"
                className="ink-button"
                onClick={() => onEdit(selectedElementId)}
              >
                Edit
              </button>
            )}
            <button type="button" className="ink-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}

        {elements.map((element) => {
          if (element.type === "image") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                }}
              >
                <img
                  src={element.url}
                  alt=""
                  className={`block w-full ${selectedElementId === element.id ? "outline outline-2 outline-bird-blue" : ""}`}
                  onPointerDown={(e) => handlePointerDown(e, element)}
                  onContextMenu={(e) => handleContextMenu(e, element)}
                  style={{ touchAction: "none" }}
                />

                {selectedElementId === element.id && (
                  <div
                    className="absolute h-3 w-3 bg-bird-blue cursor-se-resize"
                    onPointerDown={(e) => handleResizePointerDown(e, element)}
                    style={{
                      right: -6,
                      bottom: -6,
                      zIndex: element.zIndex + 1,
                    }}
                  />
                )}
              </div>
            );
          }

          if (element.type === "text") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.zIndex,
                }}
              >
                <div
                  className={`${selectedElementId === element.id ? "outline outline-2 outline-bird-blue" : ""}`}
                  onPointerDown={(e) => handlePointerDown(e, element)}
                  onContextMenu={(e) => handleContextMenu(e, element)}
                  style={{
                    touchAction: "none",
                  }}
                >
                  {element.content}
                </div>

                {selectedElementId === element.id && (
                  <div
                    className="absolute h-3 w-3 bg-bird-blue cursor-ew-resize"
                    onPointerDown={(e) => handleResizePointerDown(e, element)}
                    style={{
                      right: -6,
                      top: -6,
                      zIndex: element.zIndex + 1,
                    }}
                  />
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
