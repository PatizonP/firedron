import Image from "next/image";

const title = "Before, during, and after the fire";
const description =
  "DOFEC supports prevention, active intervention, and post-fire monitoring with one continuous autonomous workflow.";
const cta = "Play video";

export function TimelineSplitSection() {
  return (
    <div className="dofec-card-light grid min-h-[420px] overflow-hidden lg:min-h-[528px] lg:grid-cols-2">
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <h3 className="text-[2rem] font-semibold leading-tight text-ink sm:text-[2.6rem]">{title}</h3>
        <p className="mt-5 max-w-[480px] text-base leading-relaxed text-body-muted">{description}</p>
        <button
          type="button"
          className="mt-7 inline-flex self-start items-center gap-2 rounded-[333px] bg-body-muted/25 px-6 py-3 text-base leading-none text-ink backdrop-blur-[3px]"
          aria-label={cta}
        >
          <span className="text-[11px] leading-none">▶</span>
          <span>{cta}</span>
        </button>
      </div>

      <div className="relative min-h-[300px]">
        <Image src="/images/imgImage10.png" alt="Forest fire response background" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
        <div className="absolute bottom-0 right-0 h-[220px] w-[260px] sm:h-[260px] sm:w-[310px]">
          <Image
            src="/images/imgChatGptImage13120261408572.png"
            alt="DOFEC drone overlay"
            fill
            className="object-contain"
            sizes="310px"
          />
        </div>
      </div>
    </div>
  );
}
