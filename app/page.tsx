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
import { getPageContent } from "@/lib/directus/content";

export default async function Home() {
  const [homeContent, globalContent] = await Promise.all([
    getPageContent("home"),
    getPageContent("global"),
  ]);

  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section id="hero" size="large">
          <HeroSection content={homeContent.hero} />
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
          <AutonomousSection content={homeContent.autonomous} />
        </Section>

        <Section>
          <FireImageSplitSection content={homeContent["fire-image-split"]} />
        </Section>

        <Section>
          <EffectiveLocateSection content={homeContent["effective-locate"]} />
        </Section>

        <Section>
          <QuoteVideoSection content={homeContent["quote-video"]} />
        </Section>

        <Section>
          <FasterIntegratedSection content={homeContent["faster-integrated"]} />
        </Section>

        <Section>
          <TimelineSplitSection content={homeContent.timeline} />
          <div className="mx-auto mt-8 max-w-[696px] px-4 text-center sm:mt-10">
            <p className="text-2xl leading-[1.35] font-normal text-card-light">
              {homeContent["timeline-quote"].quote}
            </p>
            <p className="mt-8 text-base leading-normal font-normal text-orange">
              {homeContent["timeline-quote"].author}
            </p>
          </div>
        </Section>

        <Section>
          <ExplodedDroneSection content={homeContent["exploded-drone"]} />
        </Section>

        <Section>
          <StayInTouchSection
            title={homeContent["stay-in-touch"].title}
            description={homeContent["stay-in-touch"].description}
            primaryCta={homeContent["stay-in-touch"].primaryCta}
            secondaryCta={homeContent["stay-in-touch"].secondaryCta}
          />
        </Section>

        <Section className="pt-1 pb-8">
          <p className="text-center text-xs text-zinc-500">
            {globalContent.footer.copyright}
          </p>
        </Section>
      </main>
    </div>
  );
}
