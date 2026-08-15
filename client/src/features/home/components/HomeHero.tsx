import { assets } from "../../../config/assets";

export function HomeHero() {
  return (
    <section className="flex min-h-screen justify-center items-center">
      <img
        src={assets.homeGroupImageUrl}
        alt="piditi group photo"
        className="w-[320px] md:w-[520px] lg:w-[770px] -translate-y-8 md:-translate-y-12"
      />
    </section>
  );
}
