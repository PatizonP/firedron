import type { Metadata } from "next";

import { Section } from "@/components/ui/Section";
import { getPageContent } from "@/lib/directus/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("invest");

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function InvestPage() {
  const content = await getPageContent("invest");

  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section size="large">
          <div className="dofec-card-light !rounded-t-none px-5 pb-12 pt-5 sm:px-8 sm:pb-14 sm:pt-6">
            <h1 className="mt-16 text-center text-[32px] font-normal leading-none text-ink sm:mt-20">
              {content.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[640px] text-center text-sm leading-relaxed text-body-muted sm:text-base">
              {content.hero.description}
            </p>
          </div>
        </Section>

        <Section>
          <div className="mx-auto grid max-w-[912px] gap-4 sm:gap-5">
            {content.documents.items.map((document) => (
              <article
                key={document.title}
                className="dofec-card-light p-5 sm:p-6"
              >
                <h2 className="text-lg leading-tight text-ink sm:text-xl">
                  {document.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-body-muted sm:text-base">
                  {document.description}
                </p>
                <a
                  href={document.href}
                  download
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-orange px-5 text-sm font-medium text-white transition-colors hover:bg-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-card-light"
                >
                  {document.downloadLabel}
                </a>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
