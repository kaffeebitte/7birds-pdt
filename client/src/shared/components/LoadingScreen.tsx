export function LoadingScreen() {
  return (
    <main aria-busy="true" aria-live="polite">
      <img
        src="https://res.cloudinary.com/dl4ad9k0c/image/upload/v1786725810/loading.jpg"
        alt=""
      />
      <p role="status">Loading…</p>
    </main>
  );
}
