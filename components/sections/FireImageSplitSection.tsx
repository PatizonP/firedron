import Image from "next/image";

import { PhotoCarouselSection } from "@/components/sections/PhotoCarouselSection";
import type { HomeFireImageSplitContent } from "@/types/content";

const SLIDE_IMAGES = [
  { id: "fire-scene-1", imageSrc: "/images/imgSlide1700.png", priority: true },
  { id: "fire-scene-2", imageSrc: "/images/imgSlide1699.png" },
  { id: "fire-scene-3", imageSrc: "/images/imgSlide1698.png" },
] as const;

const rightImageSrc = "/images/imgChatGptImage13120261354561.png";

interface FireImageSplitSectionProps {
  content: HomeFireImageSplitContent;
}

export function FireImageSplitSection({ content }: FireImageSplitSectionProps) {
  const slides = SLIDE_IMAGES.map((slide) => {
    const imageAlt =
      content.slides.find((item) => item.id === slide.id)?.imageAlt ?? slide.id;

    return {
      ...slide,
      imageAlt,
    };
  });

  return (
    <div id="career" className="grid gap-6 lg:grid-cols-[695px_423px]">
      <PhotoCarouselSection
        slides={slides}
        mediaClassName="lg:aspect-[695/528]"
      />

      <div className="dofec-card-light flex min-h-[340px] flex-col p-6 sm:p-8 lg:min-h-[528px]">
        <div className="relative h-[180px] overflow-hidden rounded-[18px] sm:h-[220px] lg:h-[245px]">
          <Image
            src={rightImageSrc}
            alt={content.rightImageAlt}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 367px, 100vw"
          />
        </div>
        <p className="mt-6 text-base leading-relaxed text-body-muted">
          {content.description}
        </p>
      </div>
    </div>
  );
}
