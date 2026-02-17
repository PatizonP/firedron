import Image from "next/image";

interface StayInTouchSectionProps {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  decorativeImageSrc?: string;
}

export function StayInTouchSection({
  title,
  description,
  primaryCta,
  secondaryCta,
  decorativeImageSrc = "/images/imgChatGptImage13120261408572.png",
}: StayInTouchSectionProps) {
  return (
    <div
      id="contact"
      className="dofec-card-dark relative overflow-hidden px-6 py-12 text-center sm:px-8 lg:min-h-[678px] lg:py-16"
    >
      <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">DOFEC</p>
      <h3 className="mt-6 text-[2.2rem] font-semibold leading-tight text-white sm:text-[3.2rem]">
        {title}
      </h3>
      <p className="mx-auto mt-6 max-w-[700px] text-base leading-relaxed text-zinc-300 sm:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button className="inline-flex h-12 items-center rounded-full bg-orange px-7 text-sm font-medium text-white">
          {primaryCta}
        </button>
        <button className="inline-flex h-12 items-center rounded-full bg-orange px-7 text-sm font-medium text-white">
          {secondaryCta}
        </button>
      </div>

      <div className="pointer-events-none relative mx-auto mt-10 h-[220px] w-[300px] rotate-[-14deg] sm:mt-14 sm:h-[290px] sm:w-[390px]">
        <Image
          src={decorativeImageSrc}
          alt="Decorative drone visual in contact section"
          fill
          className="object-contain"
          sizes="390px"
        />
      </div>
    </div>
  );
}
