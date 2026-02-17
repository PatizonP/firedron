import { ReactNode } from "react";
import cx from "clsx";

type SectionSize = "small" | "large";

interface SectionProps {
  children: ReactNode;
  className?: string;
  size?: SectionSize;
  id?: string;
}

const containerSizeClassMap: Record<SectionSize, string> = {
  small: "max-w-[1142px] px-4 sm:px-5 lg:px-0",
  large: "max-w-[1380px] px-3 sm:px-4 lg:px-5",
};

export function Section({ id, children, className, size = "small" }: SectionProps) {
  return (
    <section id={id} className={cx("py-3 md:py-4", className)}>
      <div className={cx("mx-auto w-full", containerSizeClassMap[size])}>{children}</div>
    </section>
  );
}
