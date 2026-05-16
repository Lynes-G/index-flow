import { cn } from "@/lib/utils";

type AccentPillProps = {
  children: React.ReactNode;
  className?: string;
};

function AccentPill({ children, className }: AccentPillProps) {
  return (
    <span
      className={cn(
        "accent-pill-border inline-flex w-fit items-center rounded-full bg-[rgba(251,176,59,0.08)] px-4 py-1.5 text-[0.68rem] font-semibold tracking-[0.24em] text-[color:var(--brand-accent-ink)] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { AccentPill };
