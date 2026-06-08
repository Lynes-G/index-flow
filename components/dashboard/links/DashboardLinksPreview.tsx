import { Link2 } from "lucide-react";

import DashboardDevPreviewNotice from "@/components/dashboard/shell/DashboardDevPreviewNotice";

const previewLinks = [
  {
    href: "https://example.com/portfolio",
    title: "Portfolio",
    helperText: "A sample top link for preview mode.",
  },
  {
    href: "https://example.com/newsletter",
    title: "Newsletter",
    helperText: "A second link helps you test spacing and hierarchy.",
  },
] as const;

const PreviewLinkCard = ({
  helperText,
  href,
  title,
}: (typeof previewLinks)[number]) => (
  <div className="dashboard-subtle-card p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
        <Link2 className="size-4" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm leading-6 text-slate-600">{helperText}</p>
        <p className="font-mono text-xs break-all text-slate-500">{href}</p>
      </div>
    </div>
  </div>
);

const DashboardLinksPreview = () => {
  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardDevPreviewNotice description="You are viewing the dashboard shell without a signed-in account, so actions stay read-only and sample links stand in for live data." />

      <div className="space-y-3">
        {previewLinks.map((link) => (
          <PreviewLinkCard key={link.title} {...link} />
        ))}
      </div>
    </div>
  );
};

export default DashboardLinksPreview;
