import { useState } from "react";

type ElementAddButtonProps = {
  onAddText: () => void;
  onAddImage: () => void;
};

export function ElementAddButton({
  onAddText,
  onAddImage,
}: ElementAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-44 right-10 z-50">
      {isOpen && (
        <div className="mb-3 flex flex-col items-end gap-2">
          <button
            type="button"
            className="ink-button"
            onClick={() => {
              onAddText();
              setIsOpen(false);
            }}
          >
            Text
          </button>
          <button
            type="button"
            className="ink-button"
            onClick={() => {
              onAddImage();
              setIsOpen(false);
            }}
          >
            Image
          </button>
        </div>
      )}

      <button
        type="button"
        className="ink-button flex h-12 w-12 items-center justify-center text-2xl"
        aria-label={isOpen ? "Close add element menu" : "Add element"}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {isOpen ? "x" : "+"}
      </button>
    </div>
  );
}
