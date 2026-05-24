import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import cx from "clsx";

import { Navigation } from "@/components/sections/Navigation";
import { getPageContent } from "@/lib/directus/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const globalContent = await getPageContent("global");

  return {
    title: globalContent.metadata.title,
    description: globalContent.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalContent = await getPageContent("global");

  return (
    <html lang="cs">
      <body
        className={cx(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <div className="relative z-50 -mb-4 bg-ink pt-4 sm:-mb-5 sm:pt-5">
          <Navigation
            items={globalContent.nav.items}
            a11y={globalContent.a11y}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
