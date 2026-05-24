import Image from "next/image";

import type { HomeQuoteVideoContent } from "@/types/content";

const thumbnailSrc = "/images/imgSlide1696.png";

interface QuoteVideoSectionProps {
  content: HomeQuoteVideoContent;
}

export function QuoteVideoSection({ content }: QuoteVideoSectionProps) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[695px_423px] lg:gap-6">
      <article className="px-4 pt-2 pb-2 text-center sm:px-8 lg:px-0 lg:pt-[134px]">
        <Image
          src="/icons/imgGroup.svg"
          alt=""
          width={36}
          height={24}
          className="mx-auto h-6 w-auto"
          aria-hidden
        />
        <p className="mx-auto mt-8 max-w-[566px] text-2xl leading-[1.2] font-normal text-card-light">
          {content.quote}
        </p>
        {content.author ? (
          <p className="mt-8 text-sm tracking-[0.02em] text-card-light">
            {content.author}
          </p>
        ) : null}
      </article>

      <article className="dofec-card-light relative min-h-[360px] overflow-hidden lg:h-[528px]">
        <Image
          src={thumbnailSrc}
          alt={content.thumbnailAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 423px"
        />
        <div
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange text-3xl text-white"
          aria-label={content.playLabel}
        >
          ▶
        </div>
      </article>
    </div>
  );
}
