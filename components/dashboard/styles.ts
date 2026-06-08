export const dashboardSurfaceClasses = {
  pageShell: "mx-auto w-full max-w-7xl px-2.5 max-[375px]:px-2 sm:px-4 lg:px-8",
  card: "dashboard-product-card",
  cardPaddingCompact: "p-3.5 sm:p-4",
  cardPadding: "p-3.5 max-[375px]:p-3 sm:p-5",
  cardPaddingCozy: "p-4 max-[375px]:p-3.5 sm:p-5",
  cardPaddingRelaxed: "p-4 max-[375px]:p-3.5 sm:p-6 lg:p-8",
  cardPaddingLarge: "p-5 sm:p-6 lg:p-8",
  contextRail: "dashboard-flat-surface rounded-lg p-3.5 sm:p-5 xl:p-3 2xl:p-4",
  flatSection:
    "dashboard-flat-surface rounded-lg p-4 max-[375px]:p-3.5 sm:p-6 xl:p-7",
  flatToolbar: "dashboard-flat-surface rounded-lg p-1.5 sm:p-2",
  flatPanel: "dashboard-flat-surface rounded-lg p-3.5 sm:p-5",
  flatCard: "dashboard-flat-surface rounded-lg p-4",
  flatNavHeader: "dashboard-flat-surface rounded-lg px-3.5 py-3",
  flatWidePanel:
    "dashboard-flat-surface grid gap-6 rounded-lg p-6 xl:grid-cols-[minmax(0,1.1fr)_380px] xl:items-center xl:gap-8 xl:p-8",
  inset: "dashboard-product-inset",
  insetPadding: "p-4 sm:p-5",
} as const;

export const dashboardTextClasses = {
  eyebrow: "text-xs font-semibold tracking-[0.18em] uppercase",
  mutedBody: "text-sm leading-6 text-slate-600",
  sectionTitle:
    "font-['Sora',sans-serif] text-[1.75rem] font-black tracking-normal text-slate-900 sm:text-2xl",
} as const;

export const dashboardMetricClasses = {
  card: `${dashboardSurfaceClasses.card} ${dashboardSurfaceClasses.cardPadding}`,
  icon: "rounded-lg border border-[color:color-mix(in_srgb,var(--brand-eggplant)_16%,transparent)] bg-slate-50 p-3",
  summaryPanel: `${dashboardSurfaceClasses.card} p-3.5 sm:p-5`,
} as const;
