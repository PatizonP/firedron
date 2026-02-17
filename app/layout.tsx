import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import cx from "clsx";

import { Navigation } from "@/components/sections/Navigation";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOFEC",
  description: "DOFEC autonomous drone fire-fighting platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={cx(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <div className="relative z-50 -mb-4 bg-ink pt-4 sm:-mb-5 sm:pt-5">
          <Navigation />
        </div>
        {children}
      </body>
    </html>
  );
}
