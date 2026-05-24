"use client";

import cx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { GlobalA11yContent, NavItemContent } from "@/types/content";

export interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavItemContent[];
  a11y: GlobalA11yContent;
}

function resolveLinkHref(itemHref: string, pathname: string): string {
  if (!itemHref.startsWith("#")) {
    return itemHref;
  }

  return pathname === "/" ? itemHref : `/${itemHref}`;
}

export function Navigation({ items, a11y }: NavigationProps) {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 44);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const activeSectionItems = items.filter((item) =>
      item.href.startsWith("#"),
    );

    if (activeSectionItems.length === 0) {
      return;
    }

    const onScroll = () => {
      const activationLine = 140;
      let nextActiveHref: string | null = null;

      for (const item of activeSectionItems) {
        const section = document.getElementById(item.href.slice(1));

        if (!(section instanceof HTMLElement)) {
          continue;
        }

        if (section.getBoundingClientRect().top <= activationLine) {
          nextActiveHref = item.href;
        }
      }

      setActiveHref((previous) =>
        previous === nextActiveHref ? previous : nextActiveHref,
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [items, pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isItemActive = (itemHref: string) => {
    if (itemHref.startsWith("#")) {
      return pathname.includes(itemHref);
    }

    return pathname === itemHref;
  };

  return (
    <header
      className={cx(
        isSticky ? "fixed inset-x-0 top-0  pt-3 sm:pt-4" : "relative",
        "z-1000 transition-all duration-300",
      )}
    >
      <div className="mx-auto w-full max-w-[1380px] px-3 sm:px-4 lg:px-5">
        <div
          className={cx(
            isSticky
              ? "rounded-[24px] border border-zinc-300/80 bg-card-light px-5 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 sm:px-8"
              : "rounded-t-[24px] bg-card-light px-5 py-4 transition-all duration-300 sm:px-8",
          )}
        >
          <div className="relative flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label={a11y.logoLabel}
            >
              <Image
                src="/icons/imgGroup.svg"
                alt=""
                width={35}
                height={23}
                className="h-4 w-auto"
                aria-hidden
              />
              <Image
                src="/icons/imgGroup1.svg"
                alt="DOFEC logo"
                width={131}
                height={24}
                className="h-[18px] w-auto"
              />
            </Link>

            {/* <div className="hidden items-center gap-2 rounded-full bg-body-muted/25 px-5 py-2.5 text-base text-ink md:absolute md:left-1/2 md:-translate-x-1/2 md:inline-flex">
              <Image
                src="/icons/imgGroup2.svg"
                alt=""
                width={22}
                height={15}
                className="h-[14px] w-auto"
                aria-hidden
              />
              <span>DOFEC™</span>
              <Image
                src="/icons/imgVector.svg"
                alt=""
                width={12}
                height={6}
                className="h-[6px] w-auto"
                aria-hidden
              />
            </div> */}

            <nav className="hidden items-center gap-6 text-sm text-body-muted md:flex">
              {items.map((item) => {
                const href = resolveLinkHref(item.href, pathname);
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={cx(
                      "transition-colors hover:text-ink",
                      active && "text-orange",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              aria-label={isMobileMenuOpen ? a11y.closeMenu : a11y.openMenu}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300/80 bg-card-light/70 text-ink transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden"
            >
              <span className="sr-only">
                {isMobileMenuOpen ? a11y.closeMenu : a11y.openMenu}
              </span>
              <span className="relative block h-4 w-5">
                <span
                  className={cx(
                    "absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300",
                    isMobileMenuOpen && "translate-y-[7px] rotate-45",
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300",
                    isMobileMenuOpen ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={cx(
                    "absolute left-0 top-[14px] block h-0.5 w-5 rounded-full bg-current transition-transform duration-300",
                    isMobileMenuOpen && "-translate-y-[7px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={cx(
          "fixed inset-0 z-[60] bg-card-light/95 backdrop-blur-md transition-all duration-300 ease-out md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={cx(
            "mx-auto flex h-full w-full max-w-[1142px] flex-col px-4 py-3 transition-transform duration-300 ease-out sm:px-5",
            isMobileMenuOpen ? "translate-y-0" : "translate-y-3",
          )}
        >
          <div
            className="flex items-center justify-between gap-3 border-b border-zinc-300/80 pb-3"
            onClick={(event) => event.stopPropagation()}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label={a11y.logoLabel}
            >
              <Image
                src="/icons/imgGroup.svg"
                alt=""
                width={35}
                height={23}
                className="h-4 w-auto"
                aria-hidden
              />
              <Image
                src="/icons/imgGroup1.svg"
                alt="DOFEC logo"
                width={131}
                height={24}
                className="h-[18px] w-auto"
              />
            </Link>
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={a11y.closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300/80 bg-card-light/70 text-ink transition-colors hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <span className="sr-only">{a11y.closeMenu}</span>
              <span className="relative block h-4 w-5">
                <span className="absolute left-0 top-0 block h-0.5 w-5 translate-y-[7px] rotate-45 rounded-full bg-current transition-transform duration-300" />
                <span className="absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current opacity-0 transition-opacity duration-300" />
                <span className="absolute left-0 top-[14px] block h-0.5 w-5 -translate-y-[7px] -rotate-45 rounded-full bg-current transition-transform duration-300" />
              </span>
            </button>
          </div>

          <nav
            id="mobile-nav-menu"
            className="mt-3 flex-1 overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
            aria-label={a11y.mobileNavLabel}
          >
            {items.map((item) => (
              <Link
                key={`${item.label}-mobile-full`}
                href={resolveLinkHref(item.href, pathname)}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cx(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isItemActive(item.href)
                    ? "bg-orange text-white hover:text-white"
                    : "text-body-muted hover:bg-zinc-200/70 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
