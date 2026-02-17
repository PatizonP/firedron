import Image from "next/image";

import { AutonomousSection } from "@/components/sections/AutonomousSection";
import { EffectiveLocateSection } from "@/components/sections/EffectiveLocateSection";
import { ExplodedDroneSection } from "@/components/sections/ExplodedDroneSection";
import { FasterIntegratedSection } from "@/components/sections/FasterIntegratedSection";
import { FireImageSplitSection } from "@/components/sections/FireImageSplitSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuoteVideoSection } from "@/components/sections/QuoteVideoSection";
import { StayInTouchSection } from "@/components/sections/StayInTouchSection";
import { TimelineSplitSection } from "@/components/sections/TimelineSplitSection";
import { Section } from "@/components/ui/Section";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section id="hero" size="large">
          <HeroSection />
        </Section>

        <Section>
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/icons/imgGroup.svg"
              alt=""
              width={35}
              height={23}
              className="h-[17px] w-auto invert"
              aria-hidden
            />
            <Image
              src="/icons/imgGroup1.svg"
              alt="DOFEC logo"
              width={131}
              height={24}
              className="h-[18px] w-auto invert"
            />
          </div>
        </Section>

        <Section>
          <AutonomousSection />
        </Section>

        <Section>
          <FireImageSplitSection />
        </Section>

        <Section>
          <EffectiveLocateSection />
        </Section>

        <Section>
          <QuoteVideoSection />
        </Section>

        <Section>
          <FasterIntegratedSection />
        </Section>

        <Section>
          <TimelineSplitSection />
          <div className="mx-auto mt-8 max-w-[696px] px-4 text-center sm:mt-10">
            <p className="text-2xl leading-[1.35] font-normal text-card-light">
              Důležitý citát,který je obsažen ve videu a vysvětluje buď misi
              značky nebo důležité USP dronu, případně celé služby, kterou
              nabízíme.
            </p>
            <p className="mt-8 text-base leading-normal font-normal text-orange">
              Konrád Španěl | Ředitel ZHS PRAHA
            </p>
          </div>
        </Section>

        <Section>
          <ExplodedDroneSection />
        </Section>

        <Section>
          <StayInTouchSection
            title="Stay in touch"
            description="Are you interested in DOFEC? We can contact you online or visit your team and present DOFEC in action."
            primaryCta="Kontaktovat"
            secondaryCta="Chci nabídku do mailu"
          />
        </Section>

        <Section className="pt-1 pb-8">
          <p className="text-center text-xs text-zinc-500">
            © 2026 DOFEC All rights reserved
          </p>
        </Section>
      </main>
    </div>
  );
}
