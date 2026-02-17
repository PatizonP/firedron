import Image from "next/image";
import cx from "clsx";

const DOT_ROWS = 7;
const DOT_COLS = 14;
const orange_DOTS = new Set(["2-5", "5-11"]);
const leftTitle = "Effective";
const leftDescription =
  "Krátký text o tom jak jsou effektivní, že prorazí sklo atd.";
const rightTitle = "Locate and intervention";
const rightDescription =
  "DOFEC™ is equipped with a launcher that can fire fire-extinguishing capsules during flight. In addition to its fire-fighting abilities, the drone also features onboard cameras. These cameras enable it to locate people and animals not visible to normal RGB cameras, which helps to gather crucial information about the disaster-struck area.";

export function EffectiveLocateSection() {
  return (
    <div className="grid gap-3 lg:grid-cols-[423px_695px] lg:gap-6">
      <article className="dofec-card-light relative flex min-h-[420px] flex-col overflow-hidden p-5 lg:hidden">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-orange text-[16px] leading-none text-white">
          +
        </span>
        <h3 className="mt-4 text-center text-[2rem] font-normal leading-none text-ink">
          {leftTitle}
        </h3>
        <div className="relative mx-auto mt-5 h-[230px] w-[290px]">
          <Image
            src="/images/imgImage15.png"
            alt=""
            fill
            className="object-cover mix-blend-multiply"
            sizes="290px"
          />
          <Image
            src="/images/imgImage7.png"
            alt="Fire extinguishing capsule"
            width={479}
            height={639}
            className="absolute left-1/2 top-1/2 h-[188px] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[8px_0px_18px_rgba(0,0,0,0.29)]"
          />
        </div>
        <p className="mx-auto mt-4 max-w-[304px] text-center text-[1rem]/[1.5] font-normal text-body-muted">
          {leftDescription}
        </p>
        <button
          type="button"
          className="mx-auto mt-auto inline-flex h-[40px] items-center gap-3 rounded-full bg-body-muted/25 px-6 text-[1rem] font-normal text-ink backdrop-blur-[3px]"
        >
          <span className="text-[11px] leading-none">▶</span>
          Play video
        </button>
      </article>

      <article className="dofec-card-light relative hidden h-[528px] overflow-hidden lg:block">
        <span className="absolute left-[10px] top-[10px] inline-flex size-[42px] items-center justify-center rounded-full bg-orange text-[16px] leading-none text-white">
          +
        </span>
        <h3 className="absolute left-1/2 top-[42px] -translate-x-1/2 text-center text-[32px] font-normal leading-none text-ink">
          {leftTitle}
        </h3>
        <div className="absolute left-1/2 top-[78px] h-[290px] w-[360px] -translate-x-1/2">
          <Image
            src="/images/imgImage15.png"
            alt=""
            fill
            className="object-cover mix-blend-multiply"
            sizes="360px"
          />
          <Image
            src="/images/imgImage7.png"
            alt="Fire extinguishing capsule"
            width={479}
            height={639}
            className="absolute left-1/2 top-1/2 h-[278px] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[202px_0px_57px_rgba(0,0,0,0.01),130px_0px_52px_rgba(0,0,0,0.04),73px_0px_44px_rgba(0,0,0,0.15),32px_0px_32px_rgba(0,0,0,0.26),8px_0px_18px_rgba(0,0,0,0.29)]"
          />
        </div>
        <p className="absolute left-1/2 top-[388px] w-[304px] -translate-x-1/2 text-center text-[16px]/[1.5] font-normal text-body-muted">
          {leftDescription}
        </p>
        <button
          type="button"
          className="absolute bottom-5 left-1/2 inline-flex h-[40px] -translate-x-1/2 items-center gap-3 rounded-full bg-body-muted/25 px-6 text-[16px] font-normal text-ink backdrop-blur-[3px]"
        >
          <span className="text-[11px] leading-none">▶</span>
          Play video
        </button>
      </article>

      <article className="dofec-card-light relative min-h-[420px] overflow-hidden p-5 lg:hidden">
        <h3 className="text-[2rem]/[1.04] font-normal text-ink">
          {rightTitle}
        </h3>
        <div className="mt-5 flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={`mobile-row-${rowIndex}`}
              className="flex items-center justify-between"
            >
              {Array.from({ length: 10 }).map((__, colIndex) => (
                <span
                  key={`mobile-dot-${rowIndex}-${colIndex}`}
                  className="block size-[3px] rounded-full bg-surface-tint"
                />
              ))}
            </div>
          ))}
        </div>
        <p className="mt-6 text-[1rem]/[1.55] font-normal text-body-muted">
          {rightDescription}
        </p>
      </article>

      <article className="dofec-card-light relative hidden h-[528px] overflow-hidden lg:block">
        <h3 className="absolute left-[58px] top-[42px] max-w-[360px] text-[42px]/[1.06] font-normal text-ink">
          {rightTitle}
        </h3>
        <div className="absolute left-[57px] top-[156px] flex w-[570px] flex-col gap-[21px]">
          {Array.from({ length: DOT_ROWS }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex items-center justify-between"
            >
              {Array.from({ length: DOT_COLS }).map((__, colIndex) => {
                const dotKey = `${rowIndex}-${colIndex}`;
                const isorange = orange_DOTS.has(dotKey);

                return (
                  <span
                    key={dotKey}
                    className={cx(
                      "block size-[3px] rounded-full",
                      isorange ? "bg-orange" : "bg-surface-tint",
                    )}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          ))}
        </div>
        <p className="absolute left-[57px] top-[349px] w-[567px] text-[16px]/[1.5] font-normal text-body-muted">
          {rightDescription}
        </p>
      </article>
    </div>
  );
}
