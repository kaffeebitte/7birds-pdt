export function LoadingScreen() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      <img
        src="https://res.cloudinary.com/dl4ad9k0c/image/upload/v1786725810/loading.jpg"
        alt="Loading..."
        className="w-45 h-auto animate-[spin_0.7s_linear_infinite] object-contain"
      />
      <p role="status" className="mt-8 text-3xl font-display text-bird-blue">
        Loading…
      </p>
    </main>
  );
}
