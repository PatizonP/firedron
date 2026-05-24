import Image from "next/image";

import { DroneHotspotScene } from "@/components/sections/DroneHotspotScene";
import type { HomeAutonomousContent } from "@/types/content";

const HOTSPOT_LAYOUT = [
  {
    id: "hotspot-one",
    xPercent: 61.6,
    yPercent: 43.7,
    popupOffsetX: 24,
    popupOffsetY: -36,
  },
  {
    id: "hotspot-two",
    xPercent: 50.2,
    yPercent: 63,
    popupOffsetX: 18,
    popupOffsetY: -34,
  },
] as const;

const CALLOUT_LAYOUT = {
  xPercent: 72,
  yPercent: 29,
} as const;

interface AutonomousSectionProps {
  content: HomeAutonomousContent;
}

export function AutonomousSection({ content }: AutonomousSectionProps) {
  const hotspots = HOTSPOT_LAYOUT.map((layout) => {
    const label =
      content.hotspots.find((hotspot) => hotspot.id === layout.id)?.label ??
      layout.id;

    return {
      ...layout,
      label,
    };
  });

  const callout = {
    ...CALLOUT_LAYOUT,
    label: content.calloutLabel,
  };

  return (
    <div id="invest" className="dofec-card-light z-0 overflow-hidden p-0">
      <div className="px-5 pt-8 text-center sm:px-8 sm:pt-10 lg:hidden">
        <h2 className="text-[2rem] font-semibold leading-tight text-ink sm:text-[2.6rem]">
          {content.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-body-muted">
          {content.description}
        </p>
      </div>

      <div className="relative aspect-[4/5] min-h-[340px] sm:aspect-[16/10] sm:min-h-[380px] lg:aspect-[1142/528] lg:min-h-[528px]">
        <div className="absolute left-[5.5%] top-[33.9%] z-30 hidden w-[35.55%] max-w-[406px] text-center lg:block">
          <h2 className="text-[2rem] font-semibold leading-tight text-ink">
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-body-muted">
            {content.description}
          </p>
        </div>

        <div className="absolute inset-0">
          <div className="absolute inset-y-0 -right-[26%] w-[120%] overflow-hidden sm:-right-[12%] sm:w-[92%] lg:-right-[7%] lg:w-[76%]">
            <Image
              src="/images/imgImage8.png"
              alt="Thermal fire background"
              fill
              className="-scale-y-100 rotate-180 object-cover object-center opacity-55 sm:object-right"
              sizes="(min-width: 1024px) 76vw, 100vw"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#f1f1f1_0%,rgba(241,241,241,0.86)_44%,rgba(241,241,241,0.18)_80%,rgba(241,241,241,0)_100%)] sm:bg-[linear-gradient(90deg,#f1f1f1_0%,#f1f1f1_38%,rgba(241,241,241,0.76)_56%,rgba(241,241,241,0.2)_74%,rgba(241,241,241,0)_84%)] lg:bg-[linear-gradient(90deg,#f1f1f1_0%,#f1f1f1_41%,rgba(241,241,241,0.84)_56%,rgba(241,241,241,0.2)_73%,rgba(241,241,241,0)_82%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(241,241,241,0)_32%,rgba(241,241,241,0.92)_84%)] sm:bg-[radial-gradient(circle_at_78%_52%,rgba(241,241,241,0)_30%,rgba(241,241,241,0.95)_78%)] lg:bg-[radial-gradient(circle_at_82%_53%,rgba(241,241,241,0)_26%,rgba(241,241,241,0.96)_76%)]" />
        </div>

        <DroneHotspotScene hotspots={hotspots} callout={callout} />
      </div>
    </div>
  );
}
