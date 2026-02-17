import Image from "next/image";

export function HeroSection() {
  const eyebrow = "Fire Fighting with Autonomous Drones";
  const title =
    "Get eyes on the scene faster to keep your team and people safe";
  const description =
    "An autonomous drone can help firefighters make informed decisions faster, deploy the right resources, and stay safe in real time.";
  const primaryCta = "Demo video";
  const secondaryCta = "Contact us";

  return (
    <div
      id="about"
      className="dofec-card-light rounded-t-none! relative overflow-hidden px-5 pb-0 pt-5 sm:px-8 sm:pt-6"
    >
      <div className="mx-auto max-w-180 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-[2rem] font-semibold leading-[1.12] text-ink sm:text-[2.45rem] lg:text-[3.5rem]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-160 text-base leading-relaxed text-body-muted lg:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-[333px] bg-body-muted/25 px-7 text-sm font-medium text-ink backdrop-blur-[3px]"
            aria-label={primaryCta}
          >
            <span className="text-[11px] leading-none">▶</span>
            <span>{primaryCta}</span>
          </button>
          <a
            href="#contact"
            className="inline-flex h-12 items-center rounded-full bg-orange px-7 text-sm font-medium text-white transition-colors hover:bg-orange-hover"
          >
            {secondaryCta}
          </a>
        </div>
      </div>

      <div className="relative mt-12 h-70 sm:h-90 lg:h-107.5">
        <Image
          src="/images/imgSlide1691.png"
          alt="DOFEC autonomous drone hero visual"
          fill
          className="object-cover object-center lg:object-[center_-120px]"
          sizes="(min-width: 1200px) 1142px, 100vw"
          priority
        />
      </div>
    </div>
  );
}
