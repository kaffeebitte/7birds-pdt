import type { ReactNode } from "react";

type ProfileCanvasProp = {
  children: ReactNode;
};

export function ProfileCanvas({ children }: ProfileCanvasProp) {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-bird-white
        "
    >
      {children}
    </main>
  );
}
