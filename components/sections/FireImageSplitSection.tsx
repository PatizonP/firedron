import Image from "next/image";

import { PhotoCarouselSection } from "@/components/sections/PhotoCarouselSection";
import type { CarouselSlide } from "@/components/sections/PhotoCarouselSection";

const slides: CarouselSlide[] = [
  {
    id: "fire-scene-1",
    imageSrc: "/images/imgSlide1700.png",
    imageAlt: "Fire response mission with flames and responders",
    priority: true,
  },
  {
    id: "fire-scene-2",
    imageSrc: "/images/imgSlide1699.png",
    imageAlt: "Firefighting action at night",
  },
  {
    id: "fire-scene-3",
    imageSrc: "/images/imgSlide1698.png",
    imageAlt: "Thermal-guided intervention support",
  },
];
const description =
  "Fire fighting teams can formulate an effective strategy to extinguish the fire and save as many lives as possible. This feature has the potential to be highly beneficial for search and rescue missions, as well as providing real-time updates on the situation.";
const rightImageSrc = "/images/imgChatGptImage13120261354561.png";
const rightImageAlt = "DOFEC drone rendered on the side information card";

export function FireImageSplitSection() {
  return (
    <div id="career" className="grid gap-6 lg:grid-cols-[695px_423px]">
      <PhotoCarouselSection slides={slides} mediaClassName="lg:aspect-[695/528]" />

      <div className="dofec-card-light flex min-h-[340px] flex-col p-6 sm:p-8 lg:min-h-[528px]">
        <div className="relative h-[180px] overflow-hidden rounded-[18px] sm:h-[220px] lg:h-[245px]">
          <Image src={rightImageSrc} alt={rightImageAlt} fill className="object-contain" sizes="(min-width: 1024px) 367px, 100vw" />
        </div>
        <p className="mt-6 text-base leading-relaxed text-body-muted">{description}</p>
      </div>
    </div>
  );
}
