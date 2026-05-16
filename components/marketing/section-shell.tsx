import { cn } from "@/lib/utils";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children: React.ReactNode;
  className?: string;
};

function SectionShell({
  eyebrow,
  title,
  description,
  align = "left",
  children,
  className,
}: SectionShellProps) {
  const isCentered = align === "center";

  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8 lg:py-24", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div
          className={cn(
            "max-w-3xl space-y-4",
            isCentered && "mx-auto text-center",
          )}
        >
          {eyebrow ? (
            <p className="text-[0.7rem] font-semibold tracking-[0.32em] text-[color:var(--brand-accent-ink)] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-4">
            <h2 className="font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.05em] text-[color:var(--brand-ink)] sm:text-4xl lg:text-[3.15rem]">
              {title}
            </h2>
            {description ? (
              <p className="text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

export { SectionShell };
