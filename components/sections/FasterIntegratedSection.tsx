import Image from "next/image";

import type { HomeFasterIntegratedContent } from "@/types/content";

interface FasterIntegratedSectionProps {
  content: HomeFasterIntegratedContent;
}

export function FasterIntegratedSection({
  content,
}: FasterIntegratedSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[695px_423px] lg:gap-6">
      <article className="dofec-card-light relative min-h-[420px] overflow-hidden p-6 sm:p-10 lg:h-[528px] lg:w-[695px] lg:p-16">
        <h3 className="max-w-[294px] text-[2rem] leading-tight font-normal text-ink">
          {content.title}
          <span className="ml-1 align-super text-[13px] leading-none text-orange">
            {content.accent}
          </span>
        </h3>
        <p className="mt-3 max-w-[294px] text-base leading-[1.5] text-body-muted whitespace-pre-line">
          {content.description}
        </p>

        <button
          type="button"
          className="absolute bottom-11 left-6 inline-flex items-center gap-2 rounded-[333px] bg-body-muted/25 px-6 py-3 text-base leading-none text-ink backdrop-blur-[3px] sm:left-10 lg:left-16"
          aria-label={content.ctaLabel}
        >
          <span className="text-[11px] leading-none">▶</span>
          <span>{content.ctaLabel}</span>
        </button>

        <div className="pointer-events-none absolute bottom-[22px] right-[40px] hidden text-[220px] leading-none font-medium tracking-[-0.1em] text-display-dark sm:block sm:text-[260px] lg:text-[300px]">
          {content.multiplier}
        </div>
      </article>

      <article className="dofec-card-light relative flex min-h-[420px] flex-col items-center overflow-hidden px-6 py-10 text-center sm:px-8 sm:py-12 lg:h-[528px] lg:w-[423px] lg:px-8">
        <h3 className="mt-1 text-[32px] leading-none font-normal text-ink lg:mt-[14px]">
          {content.rightTitle}
        </h3>
        <div className="relative mt-8 h-[172px] w-[258px] drop-shadow-[85px_85px_34px_rgba(0,0,0,0.01)] lg:mt-[52px]">
          <Image
            src="/images/imgIntegratedTablet.png"
            alt={content.integratedImageAlt}
            fill
            className="object-contain"
            sizes="260px"
          />
          <span className="absolute -left-[15px] -top-[18px] inline-flex h-11 w-[43px] items-center justify-center rounded-[333px] bg-orange/57 text-[26px] leading-none text-white backdrop-blur-[3px]">
            +
          </span>
        </div>
        <p className="mt-10 max-w-[330px] text-base leading-[1.5] font-normal text-body-muted">
          {content.rightDescription}
        </p>
      </article>
    </div>
  );
}
