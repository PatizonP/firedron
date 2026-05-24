export type ContentLocale = "cs" | "en";

export type ContentPage = "global" | "home" | "about-us" | "invest";

export interface NavItemContent {
  label: string;
  href: string;
}

export interface GlobalMetadataContent {
  title: string;
  description: string;
}

export interface GlobalNavContent {
  items: NavItemContent[];
}

export interface GlobalFooterContent {
  copyright: string;
}

export interface GlobalA11yContent {
  openMenu: string;
  closeMenu: string;
  mobileNavLabel: string;
  logoLabel: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
}

export interface HomeAutonomousContent {
  title: string;
  description: string;
  hotspots: Array<{ id: string; label: string }>;
  calloutLabel: string;
}

export interface HomeFireImageSplitContent {
  description: string;
  rightImageAlt: string;
  slides: Array<{ id: string; imageAlt: string }>;
}

export interface HomeEffectiveLocateContent {
  leftTitle: string;
  leftDescription: string;
  leftCta: string;
  rightTitle: string;
  rightDescription: string;
}

export interface HomeQuoteVideoContent {
  quote: string;
  author: string;
  thumbnailAlt: string;
  playLabel: string;
}

export interface HomeFasterIntegratedContent {
  title: string;
  accent: string;
  description: string;
  multiplier: string;
  ctaLabel: string;
  rightTitle: string;
  rightDescription: string;
  integratedImageAlt: string;
}

export interface HomeTimelineContent {
  title: string;
  description: string;
  cta: string;
  backgroundAlt: string;
  droneAlt: string;
}

export interface HomeTimelineQuoteContent {
  quote: string;
  author: string;
}

export interface HomeExplodedDroneContent {
  imageAlt: string;
  annotations: Array<{ id: string; label: string }>;
}

export interface HomeStayInTouchContent {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutHeroContent {
  title: string;
}

export interface AboutTextBlocksContent {
  blocks: Array<{ title: string; body: string }>;
}

export interface AboutCtaContent {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface AboutListContent {
  title: string;
  columns: string[][];
}

export interface AboutQuoteContent {
  title: string;
  quote: string;
  author: string;
}

export interface AboutExplodedContent {
  title: string;
}

export interface AboutGalleryContent {
  title: string;
}

export interface AboutContactContent {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface InvestHeroContent {
  title: string;
  description: string;
}

export interface InvestDocumentsContent {
  items: Array<{
    title: string;
    description: string;
    downloadLabel: string;
    href: string;
  }>;
}

export type SectionContentMap = {
  metadata: GlobalMetadataContent;
  nav: GlobalNavContent;
  footer: GlobalFooterContent;
  a11y: GlobalA11yContent;
  hero: HomeHeroContent | AboutHeroContent | InvestHeroContent;
  autonomous: HomeAutonomousContent;
  "fire-image-split": HomeFireImageSplitContent;
  "effective-locate": HomeEffectiveLocateContent;
  "quote-video": HomeQuoteVideoContent;
  "faster-integrated": HomeFasterIntegratedContent;
  timeline: HomeTimelineContent;
  "timeline-quote": HomeTimelineQuoteContent;
  "exploded-drone": HomeExplodedDroneContent;
  "stay-in-touch": HomeStayInTouchContent;
  "text-blocks": AboutTextBlocksContent;
  cta: AboutCtaContent;
  list: AboutListContent;
  quote: AboutQuoteContent;
  exploded: AboutExplodedContent;
  gallery: AboutGalleryContent;
  contact: AboutContactContent;
  documents: InvestDocumentsContent;
};

export type PageSections<TPage extends ContentPage> = TPage extends "global"
  ? {
      metadata: GlobalMetadataContent;
      nav: GlobalNavContent;
      footer: GlobalFooterContent;
      a11y: GlobalA11yContent;
    }
  : TPage extends "home"
    ? {
        hero: HomeHeroContent;
        autonomous: HomeAutonomousContent;
        "fire-image-split": HomeFireImageSplitContent;
        "effective-locate": HomeEffectiveLocateContent;
        "quote-video": HomeQuoteVideoContent;
        "faster-integrated": HomeFasterIntegratedContent;
        timeline: HomeTimelineContent;
        "timeline-quote": HomeTimelineQuoteContent;
        "exploded-drone": HomeExplodedDroneContent;
        "stay-in-touch": HomeStayInTouchContent;
      }
    : TPage extends "about-us"
      ? {
          metadata: GlobalMetadataContent;
          hero: AboutHeroContent;
          "text-blocks": AboutTextBlocksContent;
          cta: AboutCtaContent;
          list: AboutListContent;
          quote: AboutQuoteContent;
          exploded: AboutExplodedContent;
          gallery: AboutGalleryContent;
          contact: AboutContactContent;
        }
      : TPage extends "invest"
        ? {
            metadata: GlobalMetadataContent;
            hero: InvestHeroContent;
            documents: InvestDocumentsContent;
          }
        : never;
