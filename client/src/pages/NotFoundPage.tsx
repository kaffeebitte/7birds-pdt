import { BrandLogo } from "../shared/components/BrandLogo";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bird-blue flex flex-col overflow-hidden justify-center items-center gap-6">
      <p className="font-mono text-5xl text-bird-white ">
        404 - PAGE NOT FOUND
      </p>
      <BrandLogo className="!static text-2xl text-bird-white" />
    </div>
  );
}
