"use client";

import cx from "clsx";
import Image from "next/image";
import { useState } from "react";

export interface CarouselSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
}

interface PhotoCarouselSectionProps {
  id?: string;
  slides: CarouselSlide[];
  className?: string;
  mediaClassName?: string;
}

export function PhotoCarouselSection({
  id,
  slides,
  className,
  mediaClassName,
}: PhotoCarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      className={cx("relative overflow-hidden rounded-[24px]", className)}
    >
      <div
        className={cx(
          "relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[695/528]",
          mediaClassName,
        )}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-full w-full shrink-0">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
                priority={slide.priority}
              />
            </div>
          ))}
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2 sm:left-4 sm:top-4">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Zobrazit snímek ${index + 1}`}
                aria-current={isActive}
                className={cx(
                  "inline-flex size-10 items-center justify-center rounded-full text-sm text-white backdrop-blur-[3px] transition-colors",
                  isActive ? "bg-orange" : "bg-ink hover:bg-zinc-800",
                )}
                onClick={() => setActiveIndex(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
