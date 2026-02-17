"use client";

import { useState } from "react";

import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DroneHotspotMarker {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  popupOffsetX?: number;
  popupOffsetY?: number;
}

export interface AutonomousCallout {
  label: string;
  xPercent: number;
  yPercent: number;
}

interface DroneHotspotSceneProps {
  hotspots: DroneHotspotMarker[];
  callout: AutonomousCallout;
}

export function DroneHotspotScene({
  hotspots,
  callout,
}: DroneHotspotSceneProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <div className="relative h-full w-full">
        <div className="absolute left-[86%] top-[50%] aspect-square w-[3.6%] min-w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange sm:left-[89%] sm:w-[3.1%] lg:left-[90.1%] lg:top-[49.8%] lg:w-[2.85%]" />

        <div className="absolute left-[86%] top-[50%] hidden aspect-square w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/55 sm:block sm:w-[15.5%] lg:left-[90.1%] lg:top-[49.8%] lg:w-[13.75%]" />
        <div className="absolute left-[86%] top-[50%] hidden aspect-square w-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/45 sm:block sm:w-[33%] lg:left-[90.1%] lg:top-[49.8%] lg:w-[31.1%]" />
        <div className="absolute left-[86%] top-[50%] hidden aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/35 sm:block sm:w-[53%] lg:left-[90.1%] lg:top-[49.8%] lg:w-[50.9%]" />

        <div className="absolute left-[50%] top-[61%] h-[56%] w-[72%] -translate-x-1/2 -translate-y-1/2 sm:left-[55%] sm:top-[56%] sm:h-[58%] sm:w-[44%] lg:left-[59.8%] lg:top-[50%] lg:h-[57.9%] lg:w-[26.18%]">
          <Image
            src="/images/imgChatGptImage13120261408572.png"
            alt="DOFEC drone"
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 299px, 45vw"
          />
        </div>

        {hotspots.map((hotspot) => {
          const isActive = activeHotspotId === hotspot.id;

          return (
            <Popover
              key={hotspot.id}
              open={isActive}
              onOpenChange={(open) => {
                setActiveHotspotId(open ? hotspot.id : null);
              }}
            >
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`,
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-orange text-xl leading-none text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card-light"
                    aria-label={`Show ${hotspot.label}`}
                  >
                    +
                  </button>
                </PopoverTrigger>
              </div>

              <PopoverContent
                side="top"
                align="center"
                collisionPadding={16}
                alignOffset={hotspot.popupOffsetX ?? 0}
                sideOffset={Math.max(
                  Math.abs(hotspot.popupOffsetY ?? -36) - 20,
                  10,
                )}
                className="z-40 w-[min(92vw,360px)] rounded-2xl border-0 bg-orange px-4 py-2 text-sm font-medium text-white shadow-[0_16px_28px_rgba(0,0,0,0.28)] lg:min-w-[240px] lg:w-auto lg:rounded-full lg:text-sm"
              >
                <div className="grid grid-cols-[24px_1fr_24px] items-center gap-2 lg:grid-cols-[24px_1fr]">
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded-full border border-white/70 text-sm leading-none hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85"
                    aria-label="Close hotspot details"
                    onClick={() => setActiveHotspotId(null)}
                  >
                    ×
                  </button>
                  <span className="text-center lg:text-left">
                    {hotspot.label || callout.label}
                  </span>
                  <span aria-hidden className="size-6 lg:hidden" />
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
