import Image from "next/image";
import cx from "clsx";

import type { HomeExplodedDroneContent } from "@/types/content";

export interface ExplodedAnnotation {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
  lineWidth: number;
  align: "left" | "right";
}

const imageSrc = "/images/imgImage3.png";

const ANNOTATION_LAYOUT: Omit<ExplodedAnnotation, "label">[] = [
  {
    id: "ann-1",
    xPercent: 18,
    yPercent: 24,
    lineWidth: 120,
    align: "left",
  },
  {
    id: "ann-2",
    xPercent: 18,
    yPercent: 43,
    lineWidth: 110,
    align: "left",
  },
  {
    id: "ann-3",
    xPercent: 18,
    yPercent: 63,
    lineWidth: 128,
    align: "left",
  },
  {
    id: "ann-4",
    xPercent: 82,
    yPercent: 27,
    lineWidth: 110,
    align: "right",
  },
  {
    id: "ann-5",
    xPercent: 82,
    yPercent: 48,
    lineWidth: 130,
    align: "right",
  },
  {
    id: "ann-6",
    xPercent: 82,
    yPercent: 68,
    lineWidth: 140,
    align: "right",
  },
];

interface ExplodedDroneSectionProps {
  content: HomeExplodedDroneContent;
}

export function ExplodedDroneSection({ content }: ExplodedDroneSectionProps) {
  const annotations = ANNOTATION_LAYOUT.map((layout) => {
    const label =
      content.annotations.find((annotation) => annotation.id === layout.id)
        ?.label ?? layout.id;

    return {
      ...layout,
      label,
    };
  });

  return (
    <div className="dofec-card-dark relative min-h-[420px] overflow-hidden p-6 sm:p-8 lg:min-h-[528px]">
      <div className="relative mx-auto h-[360px] w-full max-w-[860px] sm:h-[430px]">
        <Image
          src={imageSrc}
          alt={content.imageAlt}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 860px, 100vw"
        />
      </div>

      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className={cx(
            "absolute top-0 hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.06em] text-zinc-300 lg:flex",
            annotation.align === "left"
              ? "left-6 sm:left-8"
              : "right-6 flex-row-reverse sm:right-8",
          )}
          style={{ top: `${annotation.yPercent}%` }}
        >
          <span className="inline-flex size-6 items-center justify-center rounded-full border border-zinc-500 text-[15px] text-white">
            +
          </span>
          <span className="opacity-95">{annotation.label}</span>
          <span
            className="h-px bg-zinc-500/90"
            style={{ width: `${annotation.lineWidth}px` }}
          />
        </div>
      ))}

      <div className="mt-6 grid gap-2 text-xs uppercase tracking-[0.06em] text-zinc-300 lg:hidden">
        {annotations.map((annotation) => (
          <p
            key={`${annotation.id}-mobile`}
            className="rounded-full border border-zinc-700 px-3 py-2"
          >
            {annotation.label}
          </p>
        ))}
      </div>
    </div>
  );
}
