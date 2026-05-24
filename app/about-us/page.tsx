import type { Metadata } from "next";
import Image from "next/image";
import cx from "clsx";

import { AboutGallerySection } from "@/components/sections/AboutGallerySection";
import { ExplodedDroneSection } from "@/components/sections/ExplodedDroneSection";
import { StayInTouchSection } from "@/components/sections/StayInTouchSection";
import { Section } from "@/components/ui/Section";
import { getPageContent } from "@/lib/directus/content";

const IMG_CONTACT_DRONE = "/images/about-contact-drone.png";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("about-us");

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function AboutUsPage() {
  const [aboutContent, globalContent, homeContent] = await Promise.all([
    getPageContent("about-us"),
    getPageContent("global"),
    getPageContent("home"),
  ]);

  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section size="large">
          <div className="dofec-card-light !rounded-t-none relative overflow-hidden px-5 pb-12 pt-5 sm:px-8 sm:pb-14 sm:pt-6">
            <h1 className="mt-16 text-center text-[32px] font-normal leading-none text-ink sm:mt-20">
              {aboutContent.hero.title}
            </h1>
            <Image
              src="/icons/imgGroup9.svg"
              alt=""
              width={35}
              height={23}
              className="mx-auto mt-5 h-[18px] w-auto"
              aria-hidden
            />
          </div>
        </Section>

        <Section>
          <div className="mx-auto flex max-w-[912px] flex-col gap-14 text-body-muted">
            {aboutContent["text-blocks"].blocks.map((block, index) => {
              const headingClass =
                index === 0
                  ? "text-[32px]"
                  : index === 1
                    ? "text-[28px]"
                    : index === 2
                      ? "text-[24px]"
                      : index === 3
                        ? "text-[20px]"
                        : "text-[16px]";
              const bodyClass =
                index === aboutContent["text-blocks"].blocks.length - 1
                  ? "text-[14px]"
                  : "text-[16px]";

              return (
                <article key={block.title} className="space-y-6">
                  <h2
                    className={cx(
                      headingClass,
                      "leading-[1.2] text-body-muted",
                    )}
                  >
                    {block.title}
                  </h2>
                  <p className={cx(bodyClass, "leading-[1.5]")}>{block.body}</p>
                </article>
              );
            })}
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-[912px]">
            <h2 className="text-[28px] leading-[1.5] text-body-muted">
              {aboutContent.cta.title}
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-orange px-6 text-sm font-medium text-white"
              >
                <span aria-hidden>→</span>
                {aboutContent.cta.primaryLabel}
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-body-muted/25 px-6 text-sm font-medium text-white"
              >
                <span aria-hidden>→</span>
                {aboutContent.cta.secondaryLabel}
              </button>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-[1142px] text-body-muted">
            <h2 className="text-center text-[28px] leading-[1.5]">
              {aboutContent.list.title}
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-6 text-sm leading-8 sm:grid-cols-2 lg:grid-cols-4">
              {aboutContent.list.columns.map((column, columnIndex) => (
                <ul key={`col-${columnIndex}`} className="list-disc pl-6">
                  {column.map((item, itemIndex) => (
                    <li key={`li-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-[696px] text-center">
            <h2 className="text-[28px] leading-[1.5] text-body-muted">
              {aboutContent.quote.title}
            </h2>
            <div className="mt-8 space-y-8">
              <p className="text-[24px] leading-none text-orange">&quot;</p>
              <p className="text-[24px] leading-[1.5] text-card-light">
                {aboutContent.quote.quote}
              </p>
              <p className="text-base leading-[1.5] text-orange">
                {aboutContent.quote.author}
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="mb-8 text-center text-[28px] leading-[1.5] text-body-muted">
            {aboutContent.exploded.title}
          </h2>
          <ExplodedDroneSection content={homeContent["exploded-drone"]} />
        </Section>

        <Section>
          <h2 className="mb-8 text-center text-[28px] leading-[1.5] text-body-muted">
            {aboutContent.gallery.title}
          </h2>
          <AboutGallerySection />
        </Section>

        <Section className="py-6 sm:py-8">
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
          <StayInTouchSection
            title={aboutContent.contact.title}
            description={aboutContent.contact.description}
            primaryCta={aboutContent.contact.primaryCta}
            secondaryCta={aboutContent.contact.secondaryCta}
            decorativeImageSrc={IMG_CONTACT_DRONE}
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
