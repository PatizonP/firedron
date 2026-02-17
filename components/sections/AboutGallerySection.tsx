"use client";

import cx from "clsx";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

interface AboutGalleryPhoto {
  id: string;
  src: string;
  alt: string;
  layout: "wide" | "square";
}

const photos: AboutGalleryPhoto[] = [
  {
    id: "gal-1",
    src: "/images/about-gallery-fire.png",
    alt: "Požár budovy se zásahovou jednotkou",
    layout: "wide",
  },
  {
    id: "gal-2",
    src: "/images/about-gallery-smoke.png",
    alt: "Letecký pohled na kouř v přírodním prostředí",
    layout: "square",
  },
  {
    id: "gal-3",
    src: "/images/about-gallery-smoke.png",
    alt: "Detail kouře během zásahu dronu",
    layout: "square",
  },
  {
    id: "gal-4",
    src: "/images/about-gallery-fire.png",
    alt: "Zásah hasičů u rozsáhlého požáru",
    layout: "wide",
  },
];

export function AboutGallerySection() {
  const [openIndex, setOpenIndex] = useState(-1);
  const slides = photos.map((photo) => ({ src: photo.src, alt: photo.alt }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={cx(
              "group relative overflow-hidden rounded-[24px] text-left",
              photo.layout === "wide" ? "lg:col-span-3" : "lg:col-span-2",
            )}
            aria-label={`Otevřít fotografii: ${photo.alt}`}
          >
            <div className={cx("relative", photo.layout === "wide" ? "aspect-[16/10]" : "aspect-square")}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes={
                  photo.layout === "wide"
                    ? "(min-width: 1024px) 695px, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 1024px) 423px, (min-width: 640px) 50vw, 100vw"
                }
              />
            </div>
          </button>
        ))}
      </div>

      <Lightbox open={openIndex >= 0} close={() => setOpenIndex(-1)} index={openIndex >= 0 ? openIndex : 0} slides={slides} />
    </>
  );
}
