import { cn } from "@/lib/frontend/shared/utils";

type AccentPillProps = {
  children: React.ReactNode;
  className?: string;
};

function AccentPill({ children, className }: AccentPillProps) {
  return (
    <span
      className={cn(
        "accent-pill-border bg-brand-accent-soft text-brand-accent-ink inline-flex max-w-full items-center justify-center rounded-lg px-4 py-1.5 text-center text-[0.68rem] leading-5 font-black tracking-[0.16em] [overflow-wrap:anywhere] whitespace-normal uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { AccentPill };
