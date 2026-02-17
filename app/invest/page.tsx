import type { Metadata } from "next";

import { Section } from "@/components/ui/Section";

interface InvestDocument {
  title: string;
  description: string;
  href: string;
}

const investDocuments: InvestDocument[] = [
  {
    title: "Investor Deck",
    description: "Company overview, product summary, and market opportunity.",
    href: "/documents/investor-deck.pdf",
  },
  {
    title: "Financial Highlights",
    description: "Key financial metrics and annual performance highlights.",
    href: "/documents/financial-highlights.pdf",
  },
  {
    title: "Legal & Corporate",
    description: "Basic legal and corporate documents for due diligence.",
    href: "/documents/legal-corporate.pdf",
  },
];

export const metadata: Metadata = {
  title: "Invest | DOFEC",
  description: "Download investor documents for DOFEC.",
};

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-ink">
      <main className="pb-8">
        <Section size="large">
          <div className="dofec-card-light !rounded-t-none px-5 pb-12 pt-5 sm:px-8 sm:pb-14 sm:pt-6">
            <h1 className="mt-16 text-center text-[32px] font-normal leading-none text-ink sm:mt-20">
              Invest
            </h1>
            <p className="mx-auto mt-5 max-w-[640px] text-center text-sm leading-relaxed text-body-muted sm:text-base">
              Some description
            </p>
          </div>
        </Section>

        <Section>
          <div className="mx-auto grid max-w-[912px] gap-4 sm:gap-5">
            {investDocuments.map((document) => (
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
                  Download document
                </a>
              </article>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
