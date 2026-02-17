import type { Metadata } from "next";
import Image from "next/image";
import cx from "clsx";

import { AboutGallerySection } from "@/components/sections/AboutGallerySection";
import { ExplodedDroneSection } from "@/components/sections/ExplodedDroneSection";
import { StayInTouchSection } from "@/components/sections/StayInTouchSection";
import { Section } from "@/components/ui/Section";

interface AboutTextBlock {
  title: string;
  body: string;
}

const IMG_CONTACT_DRONE = "/images/about-contact-drone.png";

const aboutHero = {
  title: "About us",
};

const aboutTextBlocks: AboutTextBlock[] = [
  {
    title: "Headline H1",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
  {
    title: "Headline H2",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
  {
    title: "Headline H3",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
  {
    title: "Headline H4",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
  {
    title: "Headline H5",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
  {
    title: "Small text",
    body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec iaculis gravida nulla. Nulla quis diam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Maecenas libero. Nulla quis diam. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nulla quis diam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Fusce tellus.",
  },
];

const aboutCta = {
  title: "Call to actions",
  primaryLabel: "Call to Action",
  secondaryLabel: "Call to Action",
};

const aboutListData = {
  title: "Odrážky a seznam",
  columns: [
    [
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
    ],
    [
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
    ],
    [
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
      "Lorem ipsum dolor sit amet",
    ],
    [
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
      "Consectetuer adipiscing elit",
    ],
  ],
};

const aboutQuote = {
  title: "Citace",
  quote:
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Nunc auctor. Cras elementum. Duis condimentum augue id magna semper rutrum. Nullam dapibus fermentum ipsum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam.",
  author: "Konrád Španěl | Ředitel ZHS PRAHA",
};

const aboutExploded = {
  title: "Obrázek",
};

const aboutGalleryTitle = "Galerie";

const aboutContact = {
  title: "Stay in touch",
  description:
    "Are you interested in DOFEC™? We can contact you online and tell you more or come to you in person and present DOFEC™ in action.",
  primaryCta: "Kontaktovat",
  secondaryCta: "Chci nabídku do mailu",
  decorativeImageSrc: IMG_CONTACT_DRONE,
};

export const metadata: Metadata = {
  title: "About us | DOFEC",
  description:
    "Learn more about the DOFEC team, mission, and field experience.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section size="large">
          <div className="dofec-card-light !rounded-t-none relative overflow-hidden px-5 pb-12 pt-5 sm:px-8 sm:pb-14 sm:pt-6">
            <h1 className="mt-16 text-center text-[32px] font-normal leading-none text-ink sm:mt-20">
              {aboutHero.title}
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
            {aboutTextBlocks.map((block, index) => {
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
                index === aboutTextBlocks.length - 1
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
              {aboutCta.title}
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-orange px-6 text-sm font-medium text-white"
              >
                <span aria-hidden>→</span>
                {aboutCta.primaryLabel}
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-body-muted/25 px-6 text-sm font-medium text-white"
              >
                <span aria-hidden>→</span>
                {aboutCta.secondaryLabel}
              </button>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto max-w-[1142px] text-body-muted">
            <h2 className="text-center text-[28px] leading-[1.5]">
              {aboutListData.title}
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-6 text-sm leading-8 sm:grid-cols-2 lg:grid-cols-4">
              {aboutListData.columns.map((column, columnIndex) => (
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
              {aboutQuote.title}
            </h2>
            <div className="mt-8 space-y-8">
              <p className="text-[24px] leading-none text-orange">&quot;</p>
              <p className="text-[24px] leading-[1.5] text-card-light">
                {aboutQuote.quote}
              </p>
              <p className="text-base leading-[1.5] text-orange">
                {aboutQuote.author}
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <h2 className="mb-8 text-center text-[28px] leading-[1.5] text-body-muted">
            {aboutExploded.title}
          </h2>
          <ExplodedDroneSection />
        </Section>

        <Section>
          <h2 className="mb-8 text-center text-[28px] leading-[1.5] text-body-muted">
            {aboutGalleryTitle}
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
            title={aboutContact.title}
            description={aboutContact.description}
            primaryCta={aboutContact.primaryCta}
            secondaryCta={aboutContact.secondaryCta}
            decorativeImageSrc={aboutContact.decorativeImageSrc}
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
