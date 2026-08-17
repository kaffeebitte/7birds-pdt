import { HomeHero } from "../features/home/components/HomeHero";
import { BrandLogo } from "../shared/components/BrandLogo";
import { HomeNav } from "../features/home/components/HomeNav";

export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <HomeHero />
      <HomeNav />
      <BrandLogo />
    </main>
  );
}
